"use client";

import React, { useState } from "react";
import Head from "next/head";

export default function Home() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Head>
        <title>FlowStream | Flow EVM Grant Streaming</title>
        <meta name="description" content="Continuous Grant Streaming on Flow EVM" />
      </Head>

      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
          FlowStream
        </div>
        <div className="space-x-6 hidden md:flex">
          <a href="#features" className="hover:text-green-400 transition">Features</a>
          <a href="#how-it-works" className="hover:text-green-400 transition">How it Works</a>
        </div>
        <button
          onClick={() => setShowDemo(!showDemo)}
          className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-full font-medium transition"
        >
          {showDemo ? "Back to Home" : "Launch App"}
        </button>
      </nav>

      {showDemo ? (
        <DemoApp />
      ) : (
        <>
          {/* Hero Section */}
          <header className="flex flex-col items-center justify-center text-center py-24 px-4">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
              Grant Streaming on <span className="text-green-400">Flow EVM</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mb-10">
              Empower your DAO with real-time, capital-efficient, and accountable grant distribution.
              Built for high-performance communities.
            </p>
            <div className="flex space-x-4">
              <button onClick={() => setShowDemo(true)} className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-8 py-3 rounded-full text-lg font-bold transition transform hover:scale-105">
                Start Streaming
              </button>
              <a href="https://dorahacks.io/flow/detail" target="_blank" className="border border-gray-600 hover:border-gray-400 px-8 py-3 rounded-full text-lg font-medium transition">
                Hackathon Details
              </a>
            </div>

            <div className="mt-20">
              <div className="relative w-full max-w-4xl mx-auto h-64 bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  Top 500 Projects Dashboard Preview
                </div>
              </div>
            </div>
          </header>

          {/* Features */}
          <section id="features" className="py-20 bg-gray-800">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-3xl font-bold mb-12 text-center">Why FlowStream?</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard
                  title="Real-Time Funding"
                  desc="Funds are streamed second-by-second. Grantees can withdraw vested amounts anytime."
                />
                <FeatureCard
                  title="Accountability"
                  desc="Grants can be cancelled by the DAO at any time if milestones aren't met, returning unspent funds."
                />
                <FeatureCard
                  title="Flow EVM Speed"
                  desc="Leverage the blazing speed and low gas costs of Flow Blockchain with full EVM compatibility."
                />
              </div>
            </div>
          </section>
        </>
      )}

      <footer className="py-8 text-center text-gray-500 text-sm">
        © 2026 FlowStream. Built for Flow GrantDAO Round 2.
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="p-8 bg-gray-900 rounded-2xl border border-gray-700 hover:border-green-500 transition">
      <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>
      <p className="text-gray-400">{desc}</p>
    </div>
  )
}

function DemoApp() {
  const [streams, setStreams] = useState([
    { id: 1, recipient: "0x123...abc", flowRate: "0.001 Flow/sec", streamed: "150.45 Flow" },
    { id: 2, recipient: "0x456...def", flowRate: "0.005 Flow/sec", streamed: "890.12 Flow" },
  ]);

  return (
    <div className="max-w-5xl mx-auto p-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Your Active Streams</h2>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium">
          + Create Stream
        </button>
      </div>

      <div className="grid gap-4">
        {streams.map((s) => (
          <div key={s.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-400 mb-1">Recipient</div>
              <div className="font-mono text-lg">{s.recipient}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Flow Rate</div>
              <div className="text-green-400 font-medium">{s.flowRate}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Total Streamed</div>
              <div className="text-2xl font-bold">{s.streamed}</div>
            </div>
            <button className="text-red-400 hover:text-red-300 font-medium border border-red-900 hover:bg-red-900/50 px-4 py-2 rounded-lg transition">
              Cancel
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-yellow-900/20 border border-yellow-700/50 rounded-xl">
        <h3 className="text-yellow-500 font-bold mb-2">⚠ Demo Mode</h3>
        <p className="text-gray-400 text-sm">
          This is a simulation. To interact with the live Flow EVM Testnet, please connect your wallet (Coming Soon).
        </p>
      </div>
    </div>
  )
}
