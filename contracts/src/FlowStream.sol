// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FlowStream {
    struct Stream {
        address sender;
        address recipient;
        uint256 flowRate; // Amount per second
        uint256 startTime;
        uint256 lastWithdrawTime;
        uint256 deposit;
        bool isActive;
    }

    mapping(uint256 => Stream) public streams;
    uint256 public nextStreamId;

    event StreamCreated(uint256 indexed streamId, address indexed sender, address indexed recipient, uint256 flowRate);
    event Withdraw(uint256 indexed streamId, uint256 amount);
    event StreamCancelled(uint256 indexed streamId, uint256 refundedAmount);

    function createStream(address recipient, uint256 flowRate) external payable {
        require(msg.value > 0, "Deposit required");
        require(flowRate > 0, "Flow rate must be > 0");
        require(recipient != address(0), "Invalid recipient");

        streams[nextStreamId] = Stream({
            sender: msg.sender,
            recipient: recipient,
            flowRate: flowRate,
            startTime: block.timestamp,
            lastWithdrawTime: block.timestamp,
            deposit: msg.value,
            isActive: true
        });

        emit StreamCreated(nextStreamId, msg.sender, recipient, flowRate);
        nextStreamId++;
    }

    function withdraw(uint256 streamId) external {
        Stream storage stream = streams[streamId];
        require(stream.isActive, "Stream not active");
        require(msg.sender == stream.recipient || msg.sender == stream.sender, "Not authorized");

        uint256 timeElapsed = block.timestamp - stream.lastWithdrawTime;
        uint256 amountToWithdraw = timeElapsed * stream.flowRate;

        // Cap withdrawal at remaining deposit
        if (amountToWithdraw > stream.deposit) {
            amountToWithdraw = stream.deposit;
            stream.isActive = false; // Stream exhausted
        }

        stream.deposit -= amountToWithdraw;
        stream.lastWithdrawTime = block.timestamp;

        (bool success, ) = stream.recipient.call{value: amountToWithdraw}("");
        require(success, "Transfer failed");

        emit Withdraw(streamId, amountToWithdraw);
    }

    function cancelStream(uint256 streamId) external {
        Stream storage stream = streams[streamId];
        require(stream.isActive, "Stream not active");
        require(msg.sender == stream.sender, "Only sender can cancel");

        // Calculate vested amount until now
        uint256 timeElapsed = block.timestamp - stream.lastWithdrawTime;
        uint256 vestedAmount = timeElapsed * stream.flowRate;
        
        uint256 refundAmount = stream.deposit;

         // Pay recipient vested amount if any left in deposit
        if (vestedAmount > 0 && refundAmount >= vestedAmount) {
             refundAmount -= vestedAmount;
             (bool recipientSuccess, ) = stream.recipient.call{value: vestedAmount}("");
             require(recipientSuccess, "Recipient transfer failed");
        } else if (refundAmount < vestedAmount) {
             // Should not happen if logic is correct, but safe fallback: recipient gets everything remaining
             (bool recipientSuccess, ) = stream.recipient.call{value: refundAmount}("");
             require(recipientSuccess, "Recipient transfer failed");
             refundAmount = 0;
        }

        if (refundAmount > 0) {
            (bool success, ) = stream.sender.call{value: refundAmount}("");
            require(success, "Refund failed");
        }

        stream.deposit = 0;
        stream.isActive = false;

        emit StreamCancelled(streamId, refundAmount);
    }
}
