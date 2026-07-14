// Web Worker for offloading intensive cryptographic operations
self.onmessage = async (e) => {
  const { type, payload } = e.data;

  try {
    if (type === 'HASH_LAB_COMPUTE') {
      const { password, saltHex, pbkdf2Iterations } = payload;
      const startTime = performance.now();

      const encoder = new TextEncoder();
      const passwordBytes = encoder.encode(password);

      // 1. SHA-256 Hashing
      const sha256Buffer = await self.crypto.subtle.digest('SHA-256', passwordBytes);
      const sha256Hex = bufToHex(sha256Buffer);
      const sha256Time = performance.now() - startTime;

      // 2. Salted SHA-256
      const saltStartTime = performance.now();
      const saltBytes = hexToBuf(saltHex || '0000000000000000');
      const saltedInput = new Uint8Array(passwordBytes.length + saltBytes.length);
      saltedInput.set(passwordBytes, 0);
      saltedInput.set(saltBytes, passwordBytes.length);
      
      const saltedSha256Buffer = await self.crypto.subtle.digest('SHA-256', saltedInput);
      const saltedSha256Hex = bufToHex(saltedSha256Buffer);
      const saltedTime = performance.now() - saltStartTime;

      // 3. PBKDF2 Key Stretching (Computational Cost Demo)
      const pbkdf2StartTime = performance.now();
      const baseKey = await self.crypto.subtle.importKey(
        'raw',
        passwordBytes,
        'PBKDF2',
        false,
        ['deriveBits']
      );

      const pbkdf2Buffer = await self.crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: saltBytes,
          iterations: pbkdf2Iterations || 100000,
          hash: 'SHA-256'
        },
        baseKey,
        256 // Derive 256 bits (32 bytes)
      );
      
      const pbkdf2Hex = bufToHex(pbkdf2Buffer);
      const pbkdf2Time = performance.now() - pbkdf2StartTime;

      // Post results back to the main thread
      self.postMessage({
        type: 'HASH_LAB_SUCCESS',
        results: {
          sha256: { hex: sha256Hex, timeMs: sha256Time.toFixed(2) },
          saltedSha256: { hex: saltedSha256Hex, timeMs: saltedTime.toFixed(2) },
          pbkdf2: { hex: pbkdf2Hex, timeMs: pbkdf2Time.toFixed(2), iterations: pbkdf2Iterations }
        }
      });
    }
  } catch (err) {
    self.postMessage({ type: 'ERROR', error: err.message });
  }
};

// Helper utilities for Binary-to-Hex conversions in Worker context
function bufToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBuf(hexString) {
  if (hexString.length % 2 !== 0) hexString = '0' + hexString;
  const numBytes = hexString.length / 2;
  const array = new Uint8Array(numBytes);
  for (let i = 0; i < numBytes; i++) {
    array[i] = parseInt(hexString.substr(i * 2, 2), 16);
  }
  return array;
}