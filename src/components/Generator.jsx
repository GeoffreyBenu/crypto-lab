import React, { useState, useEffect, useCallback } from 'react';
import { Copy, Check, RefreshCw, AlertTriangle } from 'lucide-react';

export default function Generator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(24);
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState({
    upper: true,
    lower: true,
    numbers: true,
    symbols: true,
  });

  const generatePassword = useCallback(() => {
    let charset = '';
    if (options.upper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.lower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (options.numbers) charset += '0123456789';
    if (options.symbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (charset === '') return setPassword('');

    // Use Web Crypto API for true cryptographic randomness (CSPRNG)
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset[randomValues[i] % charset.length];
    }
    setPassword(result);
    setCopied(false);
  }, [length, options]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const copyToClipboard = async () => {
    if (!password) return;
    
    // Write to clipboard
    await navigator.clipboard.writeText(password);
    setCopied(true);

    // SECURITY REQUIREMENT: Auto-clear clipboard after 15 seconds
    setTimeout(async () => {
      try {
        const currentClipboard = await navigator.clipboard.readText();
        // Only clear if the clipboard hasn't been overwritten by the user with something else
        if (currentClipboard === password) {
          await navigator.clipboard.writeText('');
        }
      } catch (err) {
        // Fallback for browsers that don't allow readText without permissions
        await navigator.clipboard.writeText(''); 
      }
      setCopied(false);
    }, 15000);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-100 tracking-tight">CSPRNG Generator</h2>
        <p className="text-zinc-400 mt-1 text-sm">Hardware-backed secure generation utilizing <code className="text-accent-400 bg-zinc-900 px-1 rounded">crypto.getRandomValues()</code>.</p>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-lg space-y-6 relative overflow-hidden">
        {/* Output Display */}
        <div className="flex items-center space-x-3">
          <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-4 font-mono text-xl text-zinc-100 break-all select-all">
            {password || 'Select options to generate...'}
          </div>
          <button
            onClick={generatePassword}
            className="p-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
            aria-label="Regenerate"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
          <button
            onClick={copyToClipboard}
            className={`p-4 rounded-lg flex items-center justify-center transition-all ${
              copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-accent-600 hover:bg-accent-500 text-white'
            }`}
          >
            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
          </button>
        </div>

        {copied && (
          <div className="flex items-center space-x-2 text-emerald-400 text-xs animate-in fade-in">
            <AlertTriangle className="h-4 w-4" />
            <span>Copied to system clipboard. Will auto-clear in 15 seconds to prevent leaks.</span>
          </div>
        )}

        <hr className="border-zinc-800" />

        {/* Controls */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">Length</label>
              <span className="text-xs font-mono text-accent-400">{length} chars</span>
            </div>
            <input
              type="range"
              min="8"
              max="128"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-accent-500"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              { id: 'upper', label: 'Uppercase' },
              { id: 'lower', label: 'Lowercase' },
              { id: 'numbers', label: 'Numbers' },
              { id: 'symbols', label: 'Symbols' },
            ].map((opt) => (
              <label key={opt.id} className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={options[opt.id]}
                  onChange={(e) => setOptions({ ...options, [opt.id]: e.target.checked })}
                  className="w-4 h-4 rounded border-zinc-700 text-accent-500 focus:ring-accent-500 focus:ring-offset-zinc-900 bg-zinc-900"
                />
                <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}