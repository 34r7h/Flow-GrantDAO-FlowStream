// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/FlowStream.sol";

contract FlowStreamTest is Test {
    FlowStream public flowStream;
    address public sender = address(1);
    address public recipient = address(2);

    function setUp() public {
        flowStream = new FlowStream();
        vm.deal(sender, 100 ether);
    }

    function testCreateStream() public {
        vm.prank(sender);
        flowStream.createStream{value: 10 ether}(recipient, 1 ether); // 1 ether per second
        
        (address _sender, address _recipient, uint256 _flowRate, , , uint256 _deposit, bool _isActive) = flowStream.streams(0);
        
        assertEq(_sender, sender);
        assertEq(_recipient, recipient);
        assertEq(_flowRate, 1 ether);
        assertEq(_deposit, 10 ether);
        assertTrue(_isActive);
    }

    function testWithdraw() public {
        vm.prank(sender);
        flowStream.createStream{value: 10 ether}(recipient, 1 ether);

        vm.warp(block.timestamp + 2); // 2 seconds later

        vm.prank(recipient);
        flowStream.withdraw(0);

        // Recipient should have received 2 ether
        assertEq(recipient.balance, 2 ether);
        
        (, , , , , uint256 _deposit, ) = flowStream.streams(0);
        assertEq(_deposit, 8 ether); // 10 - 2
    }

    function testCancelStream() public {
        vm.prank(sender);
        flowStream.createStream{value: 10 ether}(recipient, 1 ether);

        vm.warp(block.timestamp + 2); // 2 seconds later

        vm.prank(sender);
        flowStream.cancelStream(0);

        // Recipient should get vested 2 ether
        assertEq(recipient.balance, 2 ether);
        
        // Sender should get refunded remaining 8 ether (started with 100, spent 10, got 8 back = 98)
        assertEq(sender.balance, 98 ether);

         (, , , , , , bool _isActive) = flowStream.streams(0);
        assertFalse(_isActive);
    }
}
