# ZSol — Solana CLI Wallet | Bun + TypeScript

A lightweight CLI wallet for the **Solana blockchain**, built with **TypeScript + Bun**.  
Easily manage your Solana keys, view balances, and send SOL directly from your terminal. 🚀  

## ✨ Features  
- 🔑 Generate or import Solana keypairs  
- 📂 Supports **base58 (Phantom)** private keys  
- 👀 View public key & wallet balance  
- 📤 Send SOL transactions with success/failure feedback  
- ⚡ Built on **@solana/web3.js**  
- 🌀 Interactive CLI powered by **@clack/prompts**  

## 📦 Installation  

Clone the repo and install dependencies:  

```bash
git clone https://github.com/yourusername/zsol.git
cd zsol
bun install
```

Install CLI globally:

```bash
bun link
bun link zsol
```

Run the CLI:

```bash
bun run index.ts
```

## Usage

When you run CLI:

```bash
┌  Welcome to ZSol — a Solana CLI Wallet 🚀
│
◇  Do you already have a keypair? (Yes/No)
```
* Yes : Paste your private key (base58)
* No : A new keypair will be generated for you

### Example Output:

```bash
✅ Wallet successfully loaded!

🔹 Public Key:
    Gf8sNn3o...

🔸 Secret Key (base58):
    3cU8v4JRi...

⚠ Keep your secret key safe. Do NOT share it with anyone.

💰 Wallet Balance:
    0.523 SOL
```

### Transactions 

To send SOL, select the Send SOL option:
- Enter recipient’s public key
- Enter amount in SOL
- Spinner messages will display progress:
    - Sending transaction to Solana network...
    - Confirming transaction on blockchain...

✅ On Success

```bash
✅ Transaction confirmed!
Signature: 5GJHnZ...
```

❌ On Failure

```bash
❌ Transaction failed: insufficient funds
```

### ⚠ Security Note
- Your secret key gives full control over your wallet.
- Never share it or paste it into untrusted apps.
- Use this CLI responsibly.

## Project Structure

```bash
/zsol
├── index.ts # CLI entrypoint (handles prompts & user flow)
├── utils.ts # Helper functions (e.g., keypairFromString)
├── connectionManager.ts # Class for Solana connection handling
├── wallet.ts # Class for wallet actions
├── package.json
└── README.md
```

## Thank You

Thank you for exploring **ZSol — a Solana CLI Wallet**.  

Happy building! :)
