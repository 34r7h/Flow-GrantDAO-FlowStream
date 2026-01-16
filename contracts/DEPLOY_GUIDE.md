# Deploying FlowStream to Flow EVM Testnet

## 1. Get Flow Testnet Tokens
- Go to [Flow Facuet](https://faucet.flow.com/fund-account) (Select EVM).
- Fund your EVM address (the one you have the private key for).
- **Note**: Flow EVM uses same address format as Ethereum (0x...).

## 2. Set Private Key
Export your private key to the environment:
```bash
export PRIVATE_KEY=0x...your_private_key...
```

## 3. Deploy
Run the deployment script pointing to Flow Testnet:
```bash
cd contracts
forge script script/DeployFlowStream.s.sol:DeployFlowStream --rpc-url flow_testnet --broadcast
```

## 4. Verify
After deployment, you will get a contract address.
View it on the explorer: [Flow EVM Testnet Explorer](https://evm-testnet.flowscan.io/)
