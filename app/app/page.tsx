"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWatchContractEvent } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { parseEther, formatEther } from "viem";

// Contract Address & ABI
const CONTRACT_ADDRESS = "0x26c2533a4023ffbe9a021a0612f24bbc718b130e";
const ABI = [
  {
    "type": "function",
    "name": "createStream",
    "inputs": [
      { "name": "recipient", "type": "address", "internalType": "address" },
      { "name": "flowRate", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "cancelStream",
    "inputs": [{ "name": "streamId", "type": "uint256", "internalType": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "withdraw",
    "inputs": [{ "name": "streamId", "type": "uint256", "internalType": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getSenderStreams",
    "inputs": [{ "name": "user", "type": "address", "internalType": "address" }],
    "outputs": [{ "name": "", "type": "uint256[]", "internalType": "uint256[]" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "streams",
    "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "outputs": [
      { "name": "sender", "type": "address", "internalType": "address" },
      { "name": "recipient", "type": "address", "internalType": "address" },
      { "name": "flowRate", "type": "uint256", "internalType": "uint256" },
      { "name": "startTime", "type": "uint256", "internalType": "uint256" },
      { "name": "lastWithdrawTime", "type": "uint256", "internalType": "uint256" },
      { "name": "deposit", "type": "uint256", "internalType": "uint256" },
      { "name": "isActive", "type": "bool", "internalType": "bool" }
    ],
    "stateMutability": "view"
  }
] as const;

export default function Home() {
  const { address, isConnected } = useAccount();
  const [showDemo, setShowDemo] = useState(false);

  // Wagmi hooks
  const { writeContract, isPending } = useWriteContract();

  // Fetch user streams (IDs)
  const { data: streamIds, refetch: refetchStreamIds } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "getSenderStreams",
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  // Watch for events to refresh
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    eventName: 'StreamCreated',
    onLogs() {
      refetchStreamIds();
    },
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
          FlowStream
        </div>
        <div className="space-x-4 flex items-center">
          {/* Show Connect Button via RainbowKit */}
          <ConnectButton />
        </div>
      </nav>

      {!isConnected && !showDemo ? (
        // Hero Section (Logged Out)
        <header className="flex flex-col items-center justify-center text-center py-24 px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Grant Streaming on <span className="text-green-400">Flow EVM</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mb-10">
            Empower your DAO with real-time, capital-efficient, and accountable grant distribution.
            Built for high-performance communities.
          </p>
          <div className="flex space-x-4">
            {/* This button essentially prompts them to use the ConnectButton above */}
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <p className="font-medium text-gray-300">Connect your wallet to start streaming</p>
            </div>
          </div>
        </header>
      ) : (
        // Dashboard (Logged In)
        <div className="max-w-5xl mx-auto p-6 py-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Your Active Streams</h2>
            <CreateStreamForm writeContract={writeContract} isPending={isPending} />
          </div>

          <div className="grid gap-4">
            {streamIds && streamIds.length > 0 ? (
              streamIds.map((id) => (
                <StreamCard key={id.toString()} id={id} />
              ))
            ) : (
              <p className="text-gray-500">No active streams found.</p>
            )}
          </div>
        </div>
      )}

      <footer className="py-8 text-center text-gray-500 text-sm">
        <p>© 2026 FlowStream. Built for Flow GrantDAO Round 2.</p>
        <p className="mt-2 text-xs">
          Flow EVM Contract: <a href={`https://evm-testnet.flowscan.io/address/${CONTRACT_ADDRESS}`} target="_blank" className="text-green-500 hover:underline">{CONTRACT_ADDRESS}</a>
        </p>
      </footer>
    </div>
  );
}

function CreateStreamForm({ writeContract, isPending }: { writeContract: any, isPending: boolean }) {
  const [recipient, setRecipient] = useState("");
  const [flowRate, setFlowRate] = useState("");
  const [deposit, setDeposit] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // flowRate is in wei/sec
      // deposit is total locked
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'createStream',
        args: [recipient, BigInt(flowRate)],
        value: parseEther(deposit)
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end bg-gray-800 p-4 rounded-xl border border-gray-700">
      <div>
        <label className="block text-xs text-gray-400">Recipient</label>
        <input required placeholder="0x..." value={recipient} onChange={e => setRecipient(e.target.value)} className="bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm w-32" />
      </div>
      <div>
        <label className="block text-xs text-gray-400">Rate (Wei/sec)</label>
        <input required placeholder="100000..." value={flowRate} onChange={e => setFlowRate(e.target.value)} className="bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm w-24" />
      </div>
      <div>
        <label className="block text-xs text-gray-400">Deposit (FLOW)</label>
        <input required placeholder="1.0" value={deposit} onChange={e => setDeposit(e.target.value)} className="bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm w-20" />
      </div>
      <button disabled={isPending} type="submit" className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-1 rounded-lg font-medium text-sm h-8">
        {isPending ? "Tx Pending..." : "+ Create"}
      </button>
    </form>
  )
}

function StreamCard({ id }: { id: bigint }) {
  const { data: stream } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'streams',
    args: [id]
  });

  // Refresh ticker
  const [now, setNow] = useState(Date.now() / 1000);
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now() / 1000), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!stream) return <div className="animate-pulse bg-gray-800 h-24 rounded-xl"></div>;

  const [sender, recipient, flowRate, startTime, lastWithdrawTime, deposit, isActive] = stream;

  // Calculate streamed amount live
  // This is purely visual estimate
  const timeElapsed = BigInt(Math.floor(now)) - lastWithdrawTime;
  const vested = isActive ? (timeElapsed * flowRate) : 0n;
  // Don't show vested > deposit
  const displayVested = vested > deposit ? deposit : vested;

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex justify-between items-center">
      <div>
        <div className="text-sm text-gray-400 mb-1">Stream #{id.toString()} to <span className="font-mono text-white">{recipient.slice(0, 6)}...{recipient.slice(-4)}</span></div>
        <div className="text-xs text-gray-500">{isActive ? "🟢 Streaming" : "🔴 Ended"}</div>
      </div>
      <div>
        <div className="text-sm text-gray-400 mb-1">Flow Rate</div>
        <div className="text-green-400 font-medium font-mono text-sm">{flowRate.toString()} wei/s</div>
      </div>
      <div>
        <div className="text-sm text-gray-400 mb-1">Remaining Deposit</div>
        <div className="text-xl font-bold font-mono">{formatEther(deposit)} FLOW</div>
        <div className="text-xs text-gray-500">Unclaimed Vested: {displayVested.toString()} wei</div>
      </div>
      {/* Action Buttons would go here (Withdraw/Cancel) */}
    </div>
  )
}
