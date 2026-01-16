import { http, createConfig } from 'wagmi'
import { defineChain } from 'viem'
import { injected } from 'wagmi/connectors'

export const flowTestnet = defineChain({
    id: 545,
    name: 'Flow EVM Testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'Flow',
        symbol: 'FLOW',
    },
    rpcUrls: {
        default: { http: ['https://testnet.evm.nodes.onflow.org'] },
    },
    blockExplorers: {
        default: { name: 'FlowScan', url: 'https://evm-testnet.flowscan.io' },
    },
    testnet: true,
})

export const config = createConfig({
    chains: [flowTestnet],
    connectors: [
        injected(),
    ],
    transports: {
        [flowTestnet.id]: http(),
    },
    ssr: true,
})
