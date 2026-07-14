# CryptoLab & Password Analyzer

An educational, fully client-side single-page application built for Computer Science and InfoSec students to learn cryptographic primitives, hashing functions, and modern browser-based cryptographic APIs.

## 🛠️ Architecture & Core Concepts Covered

1. **Multithreaded Calculations (Web Workers)**
   Heavy computational loops (such as PBKDF2 with high iterations) are offloaded to `crypto.worker.js`. This guarantees that the main React threat remains responsive at a smooth 60 FPS.
   
2. **Web Crypto API Native Operations**
   Instead of using bulky JS libraries, this project utilizes `window.crypto.subtle` directly in the browser. This provides secure, native performance for high-speed cryptographic tasks.

3. **k-Anonymity Breach Verification**
   By hashing a password locally and sending only the first 5 characters of the SHA-1 hash to the HaveIBeenPwned API, we verify credentials against public leaks without revealing the user's password or full hash.

---

## 🚀 Setup & Local Deployment

### 1. Install Dependencies
```bash
npm install