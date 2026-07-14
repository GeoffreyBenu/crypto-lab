import React from 'react';
import { Shield, Activity, Flame, Terminal, Key, Lock } from 'lucide-react';

export default function Layout({ children, activeTab, setActiveTab }) {
  const navigation = [
    { id: 'strength', name: 'Entropy Analyzer', icon: Shield },
    { id: 'generator', name: 'CSPRNG Generator', icon: Key },
    { id: 'hash', name: 'KDF & Hash Lab', icon: Activity },
    { id: 'encryption', name: 'AES-GCM Lab', icon: Lock },
    { id: 'breach', name: 'k-Anonymity Check', icon: Flame },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Terminal className="h-5 w-5 text-accent-400" />
            <h1 className="text-lg font-medium tracking-wide text-zinc-100">
              CryptoLab <span className="text-zinc-600">|</span> <span className="text-zinc-400 text-sm">Security Sandbox</span>
            </h1>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-zinc-500 border border-zinc-800 px-2 py-1 rounded-md bg-zinc-900/50">
            Client-Side Only
          </div>
        </div>
        
        {/* Sleek Tab Navigation */}
        <nav className="max-w-5xl mx-auto px-6 flex space-x-6">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-all duration-200 ${
                  isActive
                    ? 'border-accent-400 text-accent-400'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-5xl mx-auto w-full px-6 py-10">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}