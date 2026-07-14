import React, { useState, useEffect } from 'react';
import { zxcvbn } from '@zxcvbn-ts/core';

export default function StrengthMeter() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!password) {
      setResult(null);
      return;
    }
    setResult(zxcvbn(password));
  }, [password]);

  const getScoreColor = (score) => {
    return ['bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-accent-500', 'bg-emerald-500'][score] || 'bg-zinc-800';
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-100 tracking-tight">Entropy Analyzer</h2>
        <p className="text-zinc-400 mt-1 text-sm">Evaluate cryptographic strength and structural predictability.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-1">
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter a payload to analyze..."
          className="w-full px-4 py-4 bg-zinc-950 border border-zinc-800 rounded-md focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/50 font-mono text-lg text-zinc-100 transition-all placeholder-zinc-700"
          spellCheck="false"
        />
      </div>

      {result && (
        <div className="space-y-8">
          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Entropy Score</span>
              <span className="font-mono text-accent-400">{result.guessesLog10.toFixed(2)} bits</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden flex space-x-1">
              {[0, 1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-full flex-1 transition-all duration-500 ${
                    step <= result.score - 1 ? getScoreColor(result.score) : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Crack Times - Dashboard Style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Online Throttled', time: result.crackTimesDisplay.onlineNoThrottling10PerSecond, desc: '10 API guesses/sec' },
              { label: 'Offline Fast Hash', time: result.crackTimesDisplay.offlineFastHashing1e10PerSecond, desc: 'Unsalted SHA-1, 10B/sec' },
              { label: 'Offline Slow Hash', time: result.crackTimesDisplay.offlineSlowHashing1e4PerSecond, desc: 'Bcrypt/Argon2, 10k/sec' }
            ].map((stat, i) => (
              <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-lg">
                <span className="text-[11px] uppercase tracking-widest text-zinc-500 font-semibold">{stat.label}</span>
                <div className="font-mono text-lg text-zinc-200 mt-2 mb-1">{stat.time}</div>
                <div className="text-xs text-zinc-600">{stat.desc}</div>
              </div>
            ))}
          </div>

          {/* Feedback Section */}
          {(result.feedback.warning || result.feedback.suggestions.length > 0) && (
            <div className="border-l-2 border-amber-500/50 bg-amber-500/5 p-4 rounded-r-lg">
              {result.feedback.warning && (
                <p className="text-amber-400 text-sm font-medium mb-2">{result.feedback.warning}</p>
              )}
              <ul className="text-sm text-zinc-400 space-y-1">
                {result.feedback.suggestions.map((s, i) => <li key={i}>— {s}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}