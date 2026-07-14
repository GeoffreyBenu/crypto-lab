import React, { useState, useEffect, useRef } from 'react';

export default function HashLab() {
  const [password, setPassword] = useState('');
  const [salt, setSalt] = useState('7a6f2b3e');
  const [iterations, setIterations] = useState(150000);
  const [results, setResults] = useState(null);
  const workerRef = useRef(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL('../workers/crypto.worker.js', import.meta.url), { type: 'module' });
    workerRef.current.onmessage = (e) => {
      if (e.data.type === 'HASH_LAB_SUCCESS') setResults(e.data.results);
    };
    return () => workerRef.current.terminate();
  }, []);

  useEffect(() => {
    if (!password) return setResults(null);
    const handler = setTimeout(() => {
      workerRef.current.postMessage({ type: 'HASH_LAB_COMPUTE', payload: { password, saltHex: salt, pbkdf2Iterations: iterations } });
    }, 300);
    return () => clearTimeout(handler);
  }, [password, salt, iterations]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-100 tracking-tight">KDF & Hash Lab</h2>
        <p className="text-zinc-400 mt-1 text-sm">Observe the computational cost of Key Derivation Functions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Parameters Column */}
        <div className="lg:col-span-4 space-y-5 bg-zinc-900/30 p-5 border border-zinc-800 rounded-lg h-fit">
          <div>
            <label className="text-[11px] uppercase tracking-widest text-zinc-500 mb-2 block">Payload</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm font-mono focus:border-accent-500 focus:outline-none text-zinc-200"
            />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-widest text-zinc-500 mb-2 block">Salt (Hex)</label>
            <input
              type="text"
              value={salt}
              onChange={(e) => setSalt(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm font-mono focus:border-accent-500 focus:outline-none text-zinc-200"
            />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-widest text-zinc-500 mb-2 block">PBKDF2 Iterations</label>
            <input
              type="number"
              value={iterations}
              onChange={(e) => setIterations(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm font-mono focus:border-accent-500 focus:outline-none text-zinc-200"
            />
          </div>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-8 space-y-4">
          {results ? (
            <>
              {[
                { title: 'Raw SHA-256', data: results.sha256, color: 'text-zinc-500' },
                { title: 'Salted SHA-256', data: results.saltedSha256, color: 'text-zinc-400' },
                { title: `PBKDF2-HMAC-SHA256 (${iterations.toLocaleString()} rounds)`, data: results.pbkdf2, color: 'text-accent-400', highlight: true }
              ].map((res, i) => (
                <div key={i} className={`p-4 rounded-lg bg-zinc-900 border ${res.highlight ? 'border-accent-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'border-zinc-800'}`}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{res.title}</span>
                    <span className={`text-xs font-mono ${res.color}`}>{res.data.timeMs}ms</span>
                  </div>
                  <div className="font-mono text-sm text-zinc-300 break-all bg-zinc-950 p-3 rounded border border-zinc-800/50">
                    {res.data.hex}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="h-full min-h-[200px] flex items-center justify-center border border-dashed border-zinc-800 rounded-lg text-zinc-600 text-sm">
              Awaiting payload input...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}