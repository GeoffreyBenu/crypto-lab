import React, { useState, useEffect } from 'react';

export default function EncryptionLab() {
  const [secret, setSecret] = useState('Top secret project coordinates.');
  const [keyMaterial, setKeyMaterial] = useState('my-secure-password');
  const [ciphertext, setCiphertext] = useState('');
  const [ivHex, setIvHex] = useState('');

  // Utility to convert ArrayBuffer to Hex String
  const bufToHex = (buffer) => {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const encryptData = async () => {
    if (!secret || !keyMaterial) return;

    try {
      const encoder = new TextEncoder();
      
      // 1. Generate a raw Key from the password (using SHA-256 for simple derivation in this lab)
      const keyBuffer = await window.crypto.subtle.digest('SHA-256', encoder.encode(keyMaterial));
      const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      );

      // 2. Generate a random 96-bit (12-byte) Initialization Vector (IV)
      // This is crucial: Never reuse an IV with the same key in AES-GCM!
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      setIvHex(bufToHex(iv));

      // 3. Encrypt the payload
      const encodedSecret = encoder.encode(secret);
      const encryptedBuffer = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        cryptoKey,
        encodedSecret
      );

      setCiphertext(bufToHex(encryptedBuffer));
    } catch (err) {
      console.error("Encryption failed", err);
    }
  };

  // Re-run encryption when inputs change to show real-time changes
  useEffect(() => {
    encryptData();
  }, [secret, keyMaterial]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-100 tracking-tight">AES-GCM Encryption Lab</h2>
        <p className="text-zinc-400 mt-1 text-sm">Observe Authenticated Encryption using <code className="text-accent-400 bg-zinc-900 px-1 rounded">crypto.subtle</code>.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Parameters */}
        <div className="space-y-4 bg-zinc-900/30 border border-zinc-800 p-5 rounded-lg h-fit">
          <div>
            <label className="text-[11px] uppercase tracking-widest text-zinc-500 mb-2 block">Secret Payload (Plaintext)</label>
            <textarea
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 focus:border-accent-500 focus:outline-none resize-none h-24"
            />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-widest text-zinc-500 mb-2 block">Encryption Key Material</label>
            <input
              type="text"
              value={keyMaterial}
              onChange={(e) => setKeyMaterial(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm font-mono text-zinc-200 focus:border-accent-500 focus:outline-none"
            />
          </div>
          
          <button 
            onClick={encryptData}
            className="w-full mt-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium rounded-lg transition-colors flex justify-center items-center space-x-2"
          >
            <span>Generate New Random IV & Re-Encrypt</span>
          </button>
        </div>

        {/* Output & Educational View */}
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">Initialization Vector (IV)</span>
              <span className="text-[10px] text-accent-400 bg-accent-400/10 px-2 py-0.5 rounded border border-accent-400/20">96-bit CSPRNG</span>
            </div>
            <div className="font-mono text-sm text-zinc-300 break-all bg-zinc-950 p-3 rounded border border-zinc-800/50">
              {ivHex || 'Waiting...'}
            </div>
            <p className="text-xs text-zinc-500 mt-3 leading-relaxed">
              <strong>InfoSec Concept:</strong> Notice how clicking "Re-Encrypt" changes the IV, which completely scrambles the resulting Ciphertext below, even though your password and payload haven't changed. This prevents pattern-recognition attacks.
            </p>
          </div>

          <div className="bg-zinc-900 border border-accent-500/30 shadow-[0_0_15px_rgba(6,182,212,0.05)] p-5 rounded-lg relative overflow-hidden">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">Resulting Ciphertext</span>
              <span className="text-[10px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">Hex Output</span>
            </div>
            <div className="font-mono text-sm text-accent-400 break-all bg-zinc-950 p-4 rounded border border-zinc-800/50 shadow-inner">
              {ciphertext || 'Waiting...'}
            </div>
            <p className="text-[11px] text-zinc-600 mt-3">
              This includes the encrypted payload plus the authentication tag appended by AES-GCM to prevent tampering.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}