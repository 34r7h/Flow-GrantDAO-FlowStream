// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/FlowStream.sol";

contract DeployFlowStream is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);

        FlowStream flowStream = new FlowStream();

        vm.stopBroadcast();
        
        console.log("FlowStream deployed to:", address(flowStream));
    }
}
