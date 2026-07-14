import React, { useState } from 'react';
import { Search, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function BreachChecker() {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle');
  const [breachCount, setBreachCount] = useState(0);

  const checkBreach = async (e) => {
    e.preventDefault();
    if (!password) return;
    setStatus('loading');

    try {
      const encoder = new TextEncoder();
      const hashBuffer = await window.crypto.subtle.digest('SHA-1', encoder.encode(password));
      const sha1 = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
      const prefix = sha1.substring(0, 5);
      const suffix = sha1.substring(5);

      const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      if (!res.ok) throw new Error('API down');
      
      const lines = (await res.text()).split('\n');
      const match = lines.find(line => line.split(':')[0] === suffix);

      if (match) {
        setBreachCount(parseInt(match.split(':')[1], 10));
        setStatus('breached');
      } else {
        setStatus('clean');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-100 tracking-tight">k-Anonymity Breach Check</h2>
        <p className="text-zinc-400 mt-1 text-sm">Securely query HIBP databases using partial SHA-1 hashes.</p>
      </div>

      <form onSubmit={checkBreach} className="flex gap-3">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter credential to verify..."
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 font-mono focus:border-accent-500 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-zinc-100 hover:bg-white text-zinc-950 px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors disabled:opacity-50"
          disabled={status === 'loading'}
        >
          <Search className="h-4 w-4" />
          <span>{status === 'loading' ? 'Verifying...' : 'Check'}</span>
        </button>
      </form>

      {status !== 'idle' && status !== 'loading' && (
        <div className={`p-6 rounded-lg border ${status === 'breached' ? 'border-red-500/30 bg-red-500/5' : 'border-emerald-500/30 bg-emerald-500/5'}`}>
          <div className="flex items-start space-x-4">
            {status === 'breached' ? (
              <ShieldAlert className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
            ) : (
              <ShieldCheck className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-1" />
            )}
            <div>
              <h3 className={`text-lg font-medium ${status === 'breached' ? 'text-red-400' : 'text-emerald-400'}`}>
                {status === 'breached' ? 'Credential Compromised' : 'No Exposures Found'}
              </h3>
              <p className="text-zinc-400 text-sm mt-1">
                {status === 'breached' 
                  ? `This exact payload was found ${breachCount.toLocaleString()} times in historical data breaches.`
                  : 'This payload did not match any known leaked databases. It remains mathematically unique.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Technical Explanation */}
      <div className="border-t border-zinc-800 pt-8 mt-8">
        <h4 className="text-xs uppercase tracking-widest font-semibold text-zinc-500 mb-4">Protocol Diagram</h4>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 font-mono text-xs text-zinc-400 space-y-2">
          <div className="flex justify-between"><span>1. Local Hashing:</span> <span className="text-zinc-300">SHA1(payload) &rarr; <span className="text-accent-400">PREFIX</span>+SUFFIX</span></div>
          <div className="flex justify-between"><span>2. Network Request:</span> <span className="text-zinc-300">GET /range/<span className="text-accent-400">PREFIX</span></span></div>
          <div className="flex justify-between"><span>3. Local Verification:</span> <span className="text-zinc-300">Match SUFFIX against response list</span></div>
        </div>
      </div>
    </div>
  );
}