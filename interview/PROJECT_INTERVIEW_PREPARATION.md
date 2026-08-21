# Project Interview Preparation

> **ZSol — Solana CLI Wallet**
> A lightweight terminal-based wallet for managing Solana keys, viewing balances, and sending SOL.
> Built with **TypeScript + Bun**.

---

## 1. Project Overview

### What the project does

ZSol is a **command-line interface (CLI) wallet** for the **Solana blockchain**. It allows users to generate or import a Solana keypair, view their wallet balance, and send SOL — all from the terminal. There is no web frontend or backend server; the entire application runs locally on the user's machine and communicates directly with the Solana blockchain via RPC.

### What problem it solves

Managing cryptocurrency wallets through a browser extension or GUI can be heavyweight and opaque. ZSol provides a **minimal, transparent, terminal-native** alternative for developers who want quick access to their Solana wallet without installing a full GUI wallet. It is useful for developers building on Solana who need to quickly check balances or send test transactions.

### Target users

- **Solana blockchain developers** who want a fast, terminal-native wallet tool.
- **CLI enthusiasts** who prefer terminal-based workflows over GUI applications.
- **Learners** studying blockchain interaction with Solana.

### Main features

1. **Keypair generation** — Create a new Solana wallet with a freshly generated keypair.
2. **Keypair import** — Import an existing private key in base58 (Phantom-compatible) or base64 format.
3. **View wallet balance** — Fetch and display the SOL balance of the wallet.
4. **Send SOL** — Transfer SOL to another Solana address with transaction confirmation.
5. **Interactive CLI** — Clean, prompt-driven user experience with spinners and status messages.

### Why the project was built

To create a simple, educational, and functional tool that demonstrates direct interaction with the Solana blockchain using TypeScript and modern tooling (Bun). It showcases cryptographic key management, transaction construction, and blockchain RPC communication.

### Overall technology stack

| Layer | Technology |
|---|---|
| Runtime | **Bun** |
| Language | **TypeScript** (strict mode) |
| Blockchain SDK | **@solana/web3.js** v1.98.4 |
| CLI Prompts | **@clack/prompts** v0.11.0 |
| Encoding | **bs58** (base58), native Buffer (base64) |
| Cryptography | **tweetnacl** (Ed25519) |
| Formatter | **Prettier** v3.6.2 |

---

## 2. "Explain Your Project" — Interview Answer

### 30-second version

"I built ZSol — a CLI wallet for the Solana blockchain written in TypeScript with Bun. It lets users generate or import a keypair, check their SOL balance, and send transactions, all from the terminal. I used `@solana/web3.js` to interact with the Solana network and built the interactive prompts with `@clack/prompts`."

### 60-second version

"I built ZSol, a lightweight CLI wallet for the Solana blockchain. The problem it solves is giving developers a fast, transparent way to manage their Solana wallet from the terminal without installing a full GUI wallet.

The main features are keypair generation and import, balance checking, and sending SOL. The tech stack is TypeScript running on Bun, with `@solana/web3.js` for Solana blockchain interaction, `tweetnacl` for Ed25519 cryptography, and `@clack/prompts` for the interactive CLI interface.

The architecture is straightforward: a main loop in `index.ts` drives user prompts, a `Wallet` class encapsulates all wallet operations, a `ConnectionManager` handles the Solana RPC connection, and a `keypairFromString` utility handles flexible private key import supporting both base58 and base64 formats.

One technical challenge I solved was handling multiple private key formats — Phantom wallets use base58 encoding while Solana's native format is base64, so I implemented a decoder chain that tries base58 first, then falls back to base64, and derives the full keypair from either a 32-byte seed or a 64-byte secret key."

### 2-minute detailed version

"ZSol is a CLI wallet for the Solana blockchain that I built using TypeScript and Bun. It addresses the need for a lightweight, terminal-native tool for Solana developers to manage their wallets quickly.

**What it does:** Users run the CLI and are prompted to either import an existing private key or generate a new one. Once the wallet is loaded, they can view their public key, check their SOL balance on the devnet, or send SOL to another address. All interactions happen through clean, interactive terminal prompts.

**Tech stack:** The project uses Bun as the runtime, TypeScript with strict mode for type safety, `@solana/web3.js` for all blockchain communication, `tweetnacl` for Ed25519 key derivation, `bs58` for base58 decoding, and `@clack/prompts` for a polished CLI experience with spinners and colored output.

**Architecture:** The codebase follows a clean separation of concerns across four files. `index.ts` is the entry point that manages the user interaction loop. `wallet.ts` contains a `Wallet` class that encapsulates keypair management, balance queries, and transaction sending. `connection.ts` has a `ConnectionManager` class that wraps the Solana RPC connection. `utils.ts` provides a `keypairFromString` function for flexible private key import.

**Key technical challenge:** The most interesting challenge was supporting multiple private key formats. Wallet exports come in different encodings — Phantom uses base58, while Solana's native format is base64. The private key can be either a 32-byte seed (which needs to be expanded to a full Ed25519 keypair using tweetnacl) or a complete 64-byte secret key. I implemented a robust decoder that tries base58 first, falls back to base64, validates the byte length, and handles both cases correctly.

**My contribution:** I designed the entire architecture, implemented all four modules, handled the edge cases in key format parsing, and ensured the CLI provides clear feedback with success/error states and confirmation prompts before transactions."

---

## 3. Architecture

```
┌─────────────────────────────────────────────────────┐
│                   User (Terminal)                    │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│              index.ts (CLI Entry Point)              │
│  - intro / prompts / confirm / select / spinner     │
│  - Main while(true) interaction loop                │
│  - Input validation (public key, amount)            │
│  - Routes to wallet operations                      │
└──────────────────────┬──────────────────────────────┘
                       │
           ┌───────────┴───────────┐
           ▼                       ▼
┌─────────────────────┐  ┌────────────────────────────┐
│   utils.ts          │  │        Wallet (wallet.ts)   │
│ keypairFromString() │  │  - Keypair management       │
│ base58 / base64     │  │  - getBalance()             │
│ tweetnacl seed ext. │  │  - sendSol()                │
└─────────────────────┘  └────────────┬───────────────┘
                                      │
                                      ▼
                           ┌──────────────────────────┐
                           │ ConnectionManager         │
                           │   (connection.ts)         │
                           │ - Wraps Solana Connection │
                           │ - Default: devnet RPC     │
                           └────────────┬─────────────┘
                                        │
                                        ▼
                           ┌──────────────────────────┐
                           │    Solana Blockchain      │
                           │  (via @solana/web3.js)    │
                           │  - RPC: devnet            │
                           │  - SystemProgram.transfer │
                           │  - getBalance             │
                           │  - sendRawTransaction     │
                           └──────────────────────────┘
```

### Component Responsibilities

| Component | File | Responsibility |
|---|---|---|
| **CLI Entry Point** | `index.ts` | Drives the entire user experience: prompts for keypair, displays wallet info, runs the main menu loop, collects inputs, calls wallet methods. |
| **Wallet** | `wallet.ts` | Encapsulates a Solana keypair and all wallet operations: generating a new keypair, displaying public/private keys, fetching balance, constructing and sending transactions. |
| **ConnectionManager** | `connection.ts` | Singleton-like wrapper around `@solana/web3.js` `Connection`. Provides a single connection to Solana devnet RPC. |
| **Key Import Utility** | `utils.ts` | Handles flexible private key parsing: tries base58 decode, falls back to base64, handles both 32-byte seeds and 64-byte full secret keys. |

### Data Flow Summary

1. User runs `bun run index.ts`
2. CLI prompts user to import a keypair or generate a new one
3. If importing: `keypairFromString()` decodes the private key into a `Keypair`
4. If generating: `Keypair.generate()` creates a fresh keypair
5. `ConnectionManager` creates an RPC connection to Solana devnet
6. `Wallet` is instantiated with the connection and keypair
7. Main loop presents menu: Show Balance / Send SOL / Exit
8. Balance: calls `wallet.getBalance()` → Solana RPC → returns SOL
9. Send SOL: collects recipient + amount → constructs Transaction → signs → sends → confirms

---

## 4. Complete Request/Data Flow

### Flow 1: Wallet Initialization (Keypair Import)

```
User runs CLI
  → intro("Welcome to ZSol...")
  → confirm("Do you already have a keypair?") → Yes
  → text("Enter your private key (base58)")
  → validate: non-empty, valid base64 check
  → keypairFromString(privateKeyBase64)  [utils.ts]
      → trim whitespace
      → try bs58.decode(input) → 64-byte secretKey → Keypair.fromSecretKey()
      → catch → try Buffer.from(input, "base64")
      → if 32 bytes → nacl.sign.keyPair.fromSeed() → build full 64-byte keypair
      → if 64 bytes → Keypair.fromSecretKey() directly
  → new ConnectionManager() → Connection(rpcUrl)
  → new Wallet(connectionManager, keypair)
  → Display: public key, secret key, warning
```

### Flow 2: Wallet Initialization (New Keypair)

```
User runs CLI
  → intro("Welcome to ZSol...")
  → confirm("Do you already have a keypair?") → No
  → new ConnectionManager() → Connection(rpcUrl)
  → new Wallet(connectionManager, null)
      → keypair || Keypair.generate()  // generates new
  → Display: public key (base58), secret key (base64), warning
```

### Flow 3: Show Balance

```
Menu → select("Show Balance")
  → spinner.start("Fetching wallet balance...")
  → wallet.getBalance()
      → connection.getBalance(this._keypair.publicKey)
      → returns lamports
      → divide by LAMPORTS_PER_SOL
  → log.message(`${balance} SOL`)
  → spinner.stop("Balance fetched successfully!")
```

### Flow 4: Send SOL

```
Menu → select("Send SOL")
  → text("Enter Receiver's public key:")
  → validate: non-empty, try new PublicKey(value)
  → text("Enter Amount in SOL")
  → validate: non-empty, isNaN check
  → confirm("Send X SOL to Y — Confirm?")
  → If confirmed:
      → spinner.start("Processing your transaction...")
      → wallet.sendSol(receiverPubKey, amountNumber)  [wallet.ts]
          → new PublicKey(receiverPubKey) if string
          → new Transaction().add(SystemProgram.transfer(...))
              → fromPubkey, toPubkey, lamports (amount * LAMPORTS_PER_SOL)
          → transaction.feePayer = this._keypair.publicKey
          → transaction.recentBlockhash = await connection.getLatestBlockhash()
          → transaction.partialSign(this._keypair)
          → connection.sendRawTransaction(transaction.serialize())
          → connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight })
          → return signature
      → log.success("Transaction confirmed! Signature: ...")
      → spinner.stop("Transaction confirmed!")
  → If cancelled:
      → log.info("Transaction cancelled.")
```

---

## 5. Technology Stack

| Technology | Where Used | Why Used | Important Interview Concepts |
|---|---|---|---|
| **TypeScript** | All `.ts` files | Type safety, interface-driven development, strict mode catches bugs at compile time | Strict mode, interfaces, classes, generics, access modifiers (`private`/`get`) |
| **Bun** | Runtime, `bun.lock`, shebang `#!/usr/bin/env bun` | Fast JavaScript/TypeScript runtime, fast package manager, native TS execution without build step | Bun vs Node.js, bun.lock, shebang scripts, ESM modules |
| **@solana/web3.js** | `wallet.ts`, `connection.ts`, `utils.ts`, `index.ts` | Official Solana SDK for RPC interaction, transaction building, key management | RPC connections, transactions, lamports, blockhash, SystemProgram, fee payer |
| **@clack/prompts** | `index.ts` | Beautiful, accessible CLI prompts with spinners, confirmations, selection menus | Terminal UI, async prompts, spinner states, isCancel handling |
| **tweetnacl** | `utils.ts` | Ed25519 key pair derivation from seed bytes | Ed25519, cryptographic keypairs, fromSeed, public-key cryptography |
| **bs58** | `utils.ts` | Base58 encoding/decoding for Phantom-compatible private keys | Base58 vs Base64, Bitcoin/Solana encoding conventions, Phantom wallet format |
| **Prettier** | `.prettierrc`, `.vscode/settings.json` | Code formatting, consistent style across the project | Code style, tab width, semicolons, format-on-save |
| **ES Modules** | `package.json` (`"type": "module"`), `tsconfig.json` | Modern module system, top-level await support | `import`/`export`, ESM vs CJS, `"module": "Preserve"` |
| **ESNext target** | `tsconfig.json` | Access to latest JavaScript features | Target compilation, modern APIs, async/await |

---

## 6. Important Terms Used in the Project

### Solana

**What it means:**
A high-performance blockchain platform known for fast, low-cost transactions. It uses a Proof of Stake consensus mechanism.

**How it is used in this project:**
The entire project is built to interact with the Solana blockchain. The `ConnectionManager` connects to Solana devnet, and all operations (balance checks, transfers) happen on Solana.

**Why it is used:**
Solana provides fast transaction finality and low fees, making it ideal for a lightweight wallet tool.

**Possible interviewer questions:**
- What is Solana's consensus mechanism?
- What is the difference between Solana devnet, testnet, and mainnet?
- How does Solana achieve high throughput?

---

### Keypair

**What it means:**
A pair of cryptographic keys: a **public key** (shared, like an address) and a **private/secret key** (kept secret, used to sign transactions). In Solana, keypairs use the Ed25519 curve.

**How it is used in this project:**
`Keypair` is generated via `Keypair.generate()` or imported via `keypairFromString()`. It is stored in the `Wallet` class and used to sign transactions and derive the public address.

**Why it is used:**
Every Solana wallet is identified by a keypair. The public key is the wallet address; the secret key proves ownership and authorizes transactions.

**Possible interviewer questions:**
- What is the relationship between a public key and a private key?
- How is a Solana keypair different from an Ethereum keypair?
- What is Ed25519?

---

### Lamports

**What it means:**
The smallest unit of SOL, similar to how cents relate to dollars. 1 SOL = 1,000,000,000 lamports (10^9).

**How it is used in this project:**
Blockchain operations work in lamports internally. The `Wallet.getBalance()` method fetches the balance in lamports from the RPC and divides by `LAMPORTS_PER_SOL` to display in SOL. The `sendSol()` method converts SOL to lamports when building the transfer instruction.

**Why it is used:**
Blockchain ledgers use the smallest indivisible unit for precision. Using lamports avoids floating-point errors in balance calculations.

**Possible interviewer questions:**
- Why does Solana use lamports instead of SOL directly?
- What happens if you send a fractional lamport?

---

### Transaction

**What it means:**
A signed instruction sent to the blockchain to perform an action (transfer tokens, call a program, etc.). A transaction contains one or more instructions, a fee payer, a recent blockhash, and cryptographic signatures.

**How it is used in this project:**
`wallet.sendSol()` constructs a `Transaction`, adds a `SystemProgram.transfer` instruction, sets the fee payer and recent blockhash, signs it, serializes it, and sends it via `sendRawTransaction`.

**Why it is used:**
Transactions are the fundamental unit of state change on Solana. Every balance transfer must be wrapped in a transaction.

**Possible interviewer questions:**
- What is a transaction fee on Solana?
- What is a recent blockhash and why is it needed?
- What happens if a transaction is not confirmed?

---

### Blockhash

**What it means:**
A unique hash of a recent block on the Solana blockchain. It is included in transactions to prevent replay attacks and ensure transactions are submitted within a valid time window.

**How it is used in this project:**
In `wallet.sendSol()`, `connection.getLatestBlockhash()` is called to set `transaction.recentBlockhash`. The same blockhash is used when confirming the transaction.

**Why it is used:**
Without a recent blockhash, the network would reject the transaction. It acts as a freshness guarantee and prevents old transactions from being replayed.

**Possible interviewer questions:**
- What happens if a transaction's blockhash expires?
- How long is a blockhash valid on Solana?

---

### SystemProgram

**What it means:**
A built-in Solana program that provides basic system-level operations like transferring SOL, creating accounts, and allocating space.

**How it is used in this project:**
`SystemProgram.transfer()` is used in `wallet.sendSol()` to create the instruction that transfers SOL from one address to another.

**Why it is used:**
`SystemProgram` is the simplest way to transfer SOL on Solana without interacting with custom programs.

**Possible interviewer questions:**
- What other operations does SystemProgram support?
- What is the difference between SystemProgram and a custom Solana program?

---

### RPC (Remote Procedure Call)

**What it means:**
A protocol that allows the client application to communicate with Solana blockchain nodes. The client sends requests (e.g., get balance, send transaction) and receives responses.

**How it is used in this project:**
`ConnectionManager` creates a `Connection` object pointing to Solana devnet's RPC endpoint. All blockchain queries and writes go through this connection.

**Why it is used:**
The CLI does not run a Solana validator — it needs to talk to one via RPC to read/write blockchain state.

**Possible interviewer questions:**
- What is the difference between public and private RPC endpoints?
- What are the rate limits of Solana RPC?
- How would you handle RPC failures?

---

### Ed25519

**What it means:**
A digital signature algorithm based on elliptic curve cryptography, widely used in Solana for key generation and transaction signing. It provides fast, secure signatures.

**How it is used in this project:**
`tweetnacl` implements Ed25519. In `keypairFromString()`, if a 32-byte seed is provided, `nacl.sign.keyPair.fromSeed()` derives the full Ed25519 keypair.

**Why it is used:**
Solana uses Ed25519 as its signature scheme. It is faster than ECDSA (used by Ethereum) and provides strong security.

**Possible interviewer questions:**
- Why does Solana use Ed25519 instead of ECDSA?
- What is the difference between a seed and a full secret key?

---

### Base58

**What it means:**
A binary-to-text encoding scheme that uses 52 alphanumeric characters (excluding 0, O, I, l) to avoid confusion. Used extensively in Bitcoin and Solana for encoding addresses and keys.

**How it is used in this project:**
`bs58.decode()` in `keypairFromString()` decodes base58-encoded private keys (common format exported by Phantom wallet). Public keys are displayed in base58 via `.toBase58()`.

**Why it is used:**
Base58 is the standard encoding for Solana public keys and Phantom wallet exports. It avoids visually ambiguous characters that hex or base64 can produce.

**Possible interviewer questions:**
- What is the difference between base58 and base64?
- Why not use hex encoding for keys?

---

### Keypair.fromSecretKey() vs Keypair.generate()

**What it means:**
`Keypair.generate()` creates a brand new random keypair. `Keypair.fromSecretKey()` reconstructs a keypair from an existing 64-byte secret key.

**How it is used in this project:**
Both are used in `wallet.ts` and `utils.ts` depending on whether the user imports an existing key or generates a new one.

**Why it is used:**
Users need to both create new wallets and import existing ones. These two methods cover both cases.

**Possible interviewer questions:**
- What is the difference between a 32-byte seed and a 64-byte secret key?
- Can you regenerate a keypair from a public key? Why or why not?

---

### LAMPORTS_PER_SOL

**What it means:**
A constant defined in `@solana/web3.js` equal to `1_000_000_000`. Used to convert between lamports and SOL.

**How it is used in this project:**
In `wallet.getBalance()`: `balance / LAMPORTS_PER_SOL` converts lamports to SOL.
In `wallet.sendSol()`: `LAMPORTS_PER_SOL * amountInSol` converts SOL to lamports.

**Why it is used:**
Ensures correct unit conversion. Using the constant avoids magic numbers and makes the code self-documenting.

**Possible interviewer questions:**
- Why not store balances directly in SOL?

---

### Spinner (CLI UX)

**What it means:**
A visual loading indicator in terminal applications that shows an animation while a long-running operation is in progress.

**How it is used in this project:**
`@clack/prompts` `spinner()` is used in `index.ts` to show loading states during balance fetches and transaction processing. The spinner starts before the async operation and stops when it completes.

**Why it is used:**
Blockchain RPC calls can take seconds. Without a spinner, the terminal would appear frozen, giving the user no feedback.

**Possible interviewer questions:**
- What UX principles does a spinner follow?
- What would you do if the RPC call hung indefinitely?

---

## 7. Database Design

### Not Applicable — No Database

This project does **not** use any database. It is a stateless CLI application that:

- Reads blockchain state directly from Solana RPC (balance queries).
- Writes state to the blockchain via transactions (SOL transfers).
- Stores no data locally — the wallet only exists in memory during the session.

### Interview-Safe Answer

"This project doesn't use a database because it's a CLI wallet that operates directly on the Solana blockchain. All state — balances, accounts, transactions — lives on-chain. The wallet keypair is held in memory during the session and is never persisted to disk, which is actually a security design decision: if the process exits, the private key is gone from memory."

**If asked: "Would you add a database?"**

"If this were expanded into a multi-session tool, I would store wallet metadata (labels, transaction history) in a lightweight local database like SQLite or even a JSON file. But I would never persist the private key on disk — that would be a serious security risk."

---

## 8. API Documentation for Interview

This project does **not** expose HTTP APIs. It interacts with the **Solana blockchain RPC API** via `@solana/web3.js`. Here are the key RPC calls used:

| Method (SDK) | Purpose | When Called | Input | Output |
|---|---|---|---|---|
| `connection.getBalance(publicKey)` | Get wallet balance in lamports | "Show Balance" menu | `PublicKey` | `number` (lamports) |
| `connection.getLatestBlockhash()` | Get recent blockhash for transaction signing | Before sending a transaction | None | `{ blockhash, lastValidBlockHeight }` |
| `connection.sendRawTransaction(serialized)` | Submit signed transaction to the network | "Send SOL" action | `Uint8Array` (serialized tx) | `TransactionSignature` |
| `connection.confirmTransaction({signature, blockhash, lastValidBlockHeight})` | Wait for transaction to be confirmed on-chain | After sending | Confirmation params | `Confirmation` |

### Key Solana RPC Concepts

- **devnet**: A development network for testing. Uses faucet SOL (free tokens for testing).
- **clusterApiUrl("devnet")**: Returns the RPC endpoint URL for Solana devnet.
- **Serialization**: Transactions are serialized into bytes before being sent to the RPC endpoint.

---

## 9. Authentication & Security

### Not Applicable — No Traditional Auth

This project does **not** implement user authentication, sessions, JWT tokens, or login systems. It is a local CLI tool — there is no server, no user accounts, and no HTTP endpoints.

### Security Mechanisms Actually Implemented

#### Keypair Security (Memory Only)

**What it does:** The private key is held only in memory during the CLI session. It is never written to disk or stored in any persistent form.

**Why it is needed:** If the private key were persisted, any attacker with filesystem access could steal the wallet. Keeping it in memory means the key is lost when the process exits, which is the safest default for a CLI tool.

**How this project implements it:** The `Keypair` object is created in `main()` and passed to the `Wallet` constructor. There is no file write, no environment variable storage, no local storage.

#### Base64 Key Display (Not Base58 for Secret)

**What it does:** The secret key is displayed in base64 format (not base58), while the public key is displayed in base58.

**Why it is needed:** Base58 is used for public keys (addresses) because it's the Solana convention. Base64 is used for secret key display because it's a standard encoding that tools can parse.

**How this project implements it:** `Buffer.from(keypair.secretKey).toString("base64")` for secret key display. `keypair.publicKey.toBase58()` for public key display.

#### Transaction Confirmation Before Sending

**What it does:** Before sending SOL, the user is asked to confirm the transaction details (amount and recipient).

**Why it is needed:** Prevents accidental or unauthorized transfers. Once a transaction is confirmed on Solana, it is irreversible.

**How this project implements it:** `await confirm({ message: \`Send ${amount} SOL to ${receiverPubKey} — Confirm?\` })` in `index.ts`.

#### Input Validation

**What it does:** Validates user inputs before processing — checks for empty inputs, valid public keys, and numeric amounts.

**Why it is needed:** Invalid inputs could cause runtime errors or, worse, send SOL to unintended addresses.

**How this project implements it:** `validate` callbacks in `@clack/prompts` `text()` calls. Public key validation tries `new PublicKey(value)` and catches errors. Amount validation checks `isNaN(parseFloat(value))`.

### ⚠ Security Weakness — Secret Key Displayed in Terminal

The secret key is printed to the terminal as part of the wallet loading flow. In a production application, this would be a significant risk — anyone who can see the terminal output (screen recording, shoulder surfing, log files) could steal the wallet.

**Interview answer if asked:** "I display the secret key because this is a development/learning tool, and the user needs to back up their key. In a production wallet, I would never display the secret key — instead, I'd store it encrypted or let the user export it securely."

---

## 10. Important Code Components

| File/Component | Responsibility | Why Important | Interview Question |
|---|---|---|---|
| **`index.ts` — `main()`** | CLI entry point, user interaction loop, input routing | Orchestrates the entire application flow | "Walk me through what happens when a user runs this CLI" |
| **`index.ts` — `while(true)` loop** | Main menu loop that keeps the application running until exit | Demonstrates event loop usage and async/await in a loop | "How does the CLI stay running and handle multiple operations?" |
| **`wallet.ts` — `Wallet` class** | Encapsulates all wallet operations (keypair, balance, send) | Demonstrates OOP design, encapsulation, and separation of concerns | "Why did you use a class instead of standalone functions?" |
| **`wallet.ts` — `sendSol()`** | Transaction construction, signing, sending, confirming | Most complex function — involves multiple async blockchain calls | "Walk me through the transaction sending process step by step" |
| **`connection.ts` — `ConnectionManager` class** | Wraps Solana RPC connection | Demonstrates abstraction over external services | "Why wrap the connection in a separate class?" |
| **`utils.ts` — `keypairFromString()`** | Flexible private key parsing with fallback logic | Demonstrates error handling, multiple format support, crypto operations | "How does your key import handle different formats?" |
| **`test.ts`** | Simple test file that creates a wallet and logs the private key | Manual testing / debugging script | "How would you properly test this application?" |

---

## 11. Difficult Technical Problems

### Problem 1: Supporting Multiple Private Key Formats

**What was difficult:**
Solana private keys can be exported in different formats — base58 (Phantom wallet format) or base64 (Solana CLI format). They can also be either 32-byte seeds or 64-byte full secret keys.

**Why it was difficult:**
Base58 and base64 are both alphanumeric encodings that can look similar. Determining which format the user provided requires trying decoders and checking byte lengths. A 32-byte input needs to be expanded to a 64-byte keypair using Ed25519 derivation, while a 64-byte input can be used directly.

**Approach:**
The `keypairFromString()` function in `utils.ts` implements a decoder chain:
1. Trim whitespace
2. Try `bs58.decode()` — if successful and yields valid bytes, proceed
3. If base58 fails, try `Buffer.from(input, "base64")`
4. Check byte length: 32 bytes → derive via `nacl.sign.keyPair.fromSeed()`, 64 bytes → use directly
5. Throw descriptive error if neither works

**Trade-offs:**
- **Alternative:** Force users to specify the format explicitly (e.g., a `--format base58` flag).
- **Chosen approach:** Auto-detect, which is more user-friendly but slightly more complex.
- **Downside:** If a user has a corrupted key, the error messages might be confusing.

**Interview Answer:**
"One of the interesting challenges was handling multiple private key formats. Phantom wallets export keys in base58, while Solana CLI uses base64. Additionally, the key can be a 32-byte seed or a full 64-byte secret. I implemented a decoder chain that tries base58 first (since it's the most common format for wallet imports), falls back to base64, then checks the byte length to determine whether to derive the keypair from a seed or use it directly. This makes the import process seamless for the user."

---

### Problem 2: Transaction Construction and Confirmation

**What was difficult:**
Constructing a valid Solana transaction requires getting a recent blockhash, setting the fee payer, signing with the keypair, serializing, sending, and then confirming — all in the correct order with proper async handling.

**Why it was difficult:**
The blockhash is time-sensitive — if it expires before confirmation, the transaction fails. The fee payer must be set correctly. The transaction must be serialized before sending. And confirmation is a separate async step that can also fail.

**Approach:**
In `wallet.sendSol()`:
1. Get latest blockhash
2. Build transaction with `SystemProgram.transfer`
3. Set `feePayer` and `recentBlockhash`
4. `partialSign` with the keypair
5. `sendRawTransaction` with serialized bytes
6. `confirmTransaction` with signature, blockhash, and last valid block height

**Trade-offs:**
- **Alternative:** Use `sendTransaction` (which auto-signs) instead of `sendRawTransaction` (manual serialization).
- **Chosen approach:** More explicit control over the signing and serialization process.

**Interview Answer:**
"Sending a Solana transaction isn't just one call — it's a multi-step process. You need to fetch a recent blockhash (which is time-sensitive), construct the transaction with the correct instruction, set the fee payer, sign it, serialize it, send it to the network, and then wait for confirmation. I chose to use `sendRawTransaction` rather than `sendTransaction` to have explicit control over serialization, which gives more visibility into what's happening."

---

### Problem 3: Keypair Derivation from Seed Bytes

**What was difficult:**
When a user provides a 32-byte private key (seed), it's not a complete keypair — it needs to be expanded using Ed25519 key derivation to produce the full 64-byte secret key (seed + public key).

**Why it was difficult:**
This requires understanding the difference between a seed and a full secret key in Ed25519 cryptography, and knowing which library to use for derivation.

**Approach:**
Used `tweetnacl`'s `nacl.sign.keyPair.fromSeed(privateKeyBytes)` to derive the full keypair from the 32-byte seed, then concatenated the seed and public key to form the 64-byte array needed by `Keypair.fromSecretKey()`.

**Trade-offs:**
- **Alternative:** Require users to always provide the full 64-byte key.
- **Chosen approach:** Support both 32 and 64-byte keys for maximum compatibility.

**Interview Answer:**
"Ed25519 keypairs can be represented as either a 32-byte seed or a full 64-byte secret key (seed + public key). Some wallets export just the seed, others export the full key. I handle both: if the decoded bytes are 32, I use tweetnacl's `fromSeed` to derive the full keypair; if they're 64, I use them directly. This ensures compatibility with any Solana wallet export format."

---

## 12. Design Decisions

### Decision 1: TypeScript (Not JavaScript)

- **Why chosen:** Type safety, better developer experience, catches bugs at compile time.
- **Alternative:** Plain JavaScript with JSDoc annotations.
- **Advantages:** `private` access modifiers, typed parameters, strict mode catches null/undefined errors.
- **Disadvantages:** Slightly more verbose, requires TypeScript tooling.
- **What I would improve:** Add stricter types for RPC responses and transaction results.

### Decision 2: Bun (Not Node.js)

- **Why chosen:** Faster startup, native TypeScript execution (no build step needed), built-in package manager.
- **Alternative:** Node.js with `ts-node` or `tsx`.
- **Advantages:** No `node_modules` compilation, faster `bun install`, shebang support (`#!/usr/bin/env bun`).
- **Disadvantages:** Smaller ecosystem, some packages may have compatibility issues (though this project's dependencies all work).
- **What I would improve:** Add a fallback for Node.js users with a `run` script in `package.json`.

### Decision 3: Class-based Architecture (Wallet, ConnectionManager)

- **Why chosen:** Encapsulation, separation of concerns, testability. Each class has a single responsibility.
- **Alternative:** All logic in `index.ts` as standalone functions.
- **Advantages:** Easy to mock for testing, clear ownership of state, reusable.
- **Disadvantages:** Slightly more boilerplate for a small project.
- **What I would improve:** Use dependency injection for `ConnectionManager` to make `Wallet` more testable.

### Decision 4: @clack/prompts (Not readline / inquirer)

- **Why chosen:** Modern, beautiful CLI prompts with built-in spinners, validation, and cancel handling.
- **Alternative:** Node.js `readline` module, or `inquirer` / `prompts`.
- **Advantages:** Clean API, great UX, TypeScript-native, lightweight.
- **Disadvantages:** Less widely known than `inquirer`, smaller community.
- **What I would improve:** Add support for arrow-key navigation in text inputs.

### Decision 5: Devnet as Default

- **Why chosen:** Safe for development and testing — devnet SOL has no real value.
- **Alternative:** Connect to mainnet by default.
- **Advantages:** Users can test freely without losing real money.
- **Disadvantages:** Users must manually switch to mainnet for real transactions.
- **What I would improve:** Add a `--network` flag to let users choose devnet/testnet/mainnet at startup.

### Decision 6: No Persistent Storage

- **Why chosen:** Security — private keys are never written to disk. The tool is designed for single-session use.
- **Alternative:** Store encrypted keys in a local file.
- **Advantages:** Maximum security for the private key.
- **Disadvantages:** Users must re-import their key every time they run the CLI.
- **What I would improve:** Add an optional encrypted keystore for users who want persistence, with a clear security warning.

---

## 13. Expected Interview Questions

### Basic Questions

**Q1: What is this project?**
> **Expected answer:** ZSol is a CLI wallet for the Solana blockchain that lets users generate or import keypairs, check balances, and send SOL from the terminal.
> **Key points:** Name, purpose, platform (Solana), interface (CLI).
> **Common mistake:** Saying it's a web application or mentioning a frontend.

**Q2: What technologies did you use?**
> **Expected answer:** TypeScript, Bun, @solana/web3.js, @clack/prompts, tweetnacl, and bs58.
> **Key points:** Each technology and its role.
> **Common mistake:** Mentioning technologies not in the project (React, MongoDB, etc.).

**Q3: Why did you build this project?**
> **Expected answer:** To learn blockchain development with Solana, practice TypeScript with modern tooling, and build a practical tool for developers.
> **Key points:** Learning motivation, practical utility.
> **Common mistake:** Saying it's a production application — it's a development/learning tool.

**Q4: What is your role in this project?**
> **Expected answer:** I designed the architecture, implemented all modules, handled edge cases in key format parsing, and ensured the CLI provides clear user feedback.
> **Key points:** End-to-end ownership.
> **Common mistake:** Being vague or claiming team work when you built it solo.

### Technical Questions

**Q5: How does the keypair import work?**
> **Expected answer:** The `keypairFromString()` function tries base58 decode first (for Phantom compatibility), falls back to base64, then checks byte length — 32 bytes are expanded via Ed25519 seed derivation, 64 bytes are used directly.
> **Key points:** Decoder chain, byte length handling, Ed25519.
> **Common mistake:** Forgetting to mention the 32 vs 64 byte distinction.

**Q6: How does sending SOL work internally?**
> **Expected answer:** A Transaction is created with a SystemProgram.transfer instruction, the fee payer and recent blockhash are set, the transaction is signed, serialized, sent via sendRawTransaction, and then confirmed.
> **Key points:** Transaction lifecycle, blockhash, signing, confirmation.
> **Common mistake:** Saying "just call `sendTransaction`" — there are multiple steps.

**Q7: What is the difference between base58 and base64?**
> **Expected answer:** Base58 uses 52 alphanumeric characters (no 0/O/I/l) for human readability. Base64 uses 64 characters including +/ and is more compact. Base58 is used for Solana addresses; base64 is used for binary data encoding.
> **Key points:** Character sets, use cases, Solana conventions.
> **Common mistake:** Saying they're the same thing.

**Q8: What is a blockhash and why is it needed?**
> **Expected answer:** A blockhash is a unique identifier of a recent block. It's included in transactions to prevent replay attacks and ensure the transaction is submitted within a valid time window (~60-90 seconds on Solana).
> **Key points:** Freshness, replay protection, expiration.
> **Common mistake:** Forgetting about expiration.

### Architecture Questions

**Q9: Walk me through the architecture.**
> **Expected answer:** Four files with clear separation: `index.ts` handles CLI interaction, `wallet.ts` encapsulates wallet operations, `connection.ts` wraps the Solana RPC connection, and `utils.ts` provides key format parsing. Data flows from CLI → Wallet → ConnectionManager → Solana RPC.
> **Key points:** Separation of concerns, data flow.
> **Common mistake:** Describing it as a client-server architecture.

**Q10: Why did you separate ConnectionManager from Wallet?**
> **Expected answer:** Single Responsibility — ConnectionManager handles only RPC connection management, while Wallet handles keypair and transaction logic. This makes each class independently testable and reusable.
> **Key points:** SRP, testability, reusability.
> **Common mistake:** Saying "just for organization" — be specific about testability.

**Q11: How would you add a new feature like transaction history?**
> **Expected answer:** I'd add a `getTransactionHistory()` method to the Wallet class that calls `connection.getSignaturesForAddress()`, then displays the results in a new menu option in `index.ts`. The architecture supports this because the Wallet class is already separated from the CLI logic.
> **Key points:** Extensibility, following existing patterns.
> **Common mistake:** Saying "I'd add it to index.ts" — it should go in the Wallet class.

### Database Questions

**Q12: Why don't you use a database?**
> **Expected answer:** All state lives on the Solana blockchain. The CLI is stateless — it reads blockchain state via RPC and writes state via transactions. There's no server-side data to persist.
> **Key points:** Blockchain as the source of truth, stateless design.
> **Common mistake:** Saying "databases aren't needed for CLI tools" — it's specifically because blockchain is the data store.

### Backend Questions

**Q13: What is an RPC connection?**
> **Expected answer:** RPC (Remote Procedure Call) is how the client communicates with a Solana blockchain node. The `Connection` object sends HTTP requests to the RPC endpoint to query state and submit transactions.
> **Key points:** HTTP-based, devnet endpoint, read/write operations.
> **Common mistake:** Confusing RPC with WebSocket (though Solana supports both).

**Q14: How does the CLI handle async operations?**
> **Expected answer:** The `main()` function is `async`, and all blockchain calls use `await`. The while loop in `main()` uses `await` for each prompt and wallet operation, ensuring operations complete before proceeding.
> **Key points:** async/await, event loop, sequential execution in the loop.
> **Common mistake:** Saying "it uses callbacks" — it uses modern async/await.

### Frontend Questions

**Q15: This is a CLI, not a web app. How do you handle the "frontend"?**
> **Expected answer:** The CLI is the interface. `@clack/prompts` provides interactive terminal prompts (text input, selection menus, confirmations, spinners). The UX is designed to be clear and informative with colored output and status messages.
> **Key points:** Terminal as UI, prompt library, UX considerations.
> **Common mistake:** Apologizing for not having a web frontend — the CLI IS the interface.

### Security Questions

**Q16: How do you handle private key security?**
> **Expected answer:** The private key exists only in memory during the session. It's never written to disk, never stored in environment variables, and never transmitted. When the process exits, the key is gone from memory.
> **Key points:** In-memory only, no persistence, process exit clears key.
> **Common mistake:** Saying "I encrypt the key" — it's not stored at all.

**Q17: What security improvements would you make?**
> **Expected answer:** I'd stop displaying the secret key in the terminal, add an encrypted keystore option, support hardware wallet integration, and add transaction limits.
> **Key points:** Specific, actionable improvements.
> **Common mistake:** Vague answers like "add more security."

### Debugging Questions

**Q18: What happens if the RPC endpoint is down?**
> **Expected answer:** The `getBalance()` or `sendSol()` calls would throw an error. Currently, `sendSol()` catches errors and displays them. For balance, the error would propagate to the main loop. I'd improve this by adding retry logic with exponential backoff.
> **Key points:** Error propagation, current handling, improvement.
> **Common mistake:** Saying "the app crashes" — it doesn't, due to try/catch.

**Q19: What if a user enters an invalid public key?**
> **Expected answer:** The `validate` callback in the `text()` prompt tries `new PublicKey(value)`. If it throws, an error message is shown and the user is prompted again. The invalid key never reaches the wallet.
> **Key points:** Input validation, fail-fast, user feedback.
> **Common mistake:** Saying "it would send to the wrong address" — validation prevents this.

**Q20: What if a transaction's blockhash expires?**
> **Expected answer:** Solana would reject the transaction with "Transaction expired" error. The `confirmTransaction` call would also fail. The user would need to retry.
> **Key points:** Blockhash expiration, retry mechanism.
> **Common mistake:** Saying "it would still go through" — it wouldn't.

### Scenario Questions

**Q21: What if 10,000 users ran this CLI simultaneously?**
> **Expected answer:** Each CLI instance is independent and connects to Solana RPC directly. The bottleneck would be the RPC node's rate limits. In production, I'd use a private RPC endpoint, add request queuing, and potentially add a caching layer for balance queries.
> **Key points:** Independence, RPC rate limits, scaling considerations.
> **Common mistake:** Saying "it would crash" — each instance is independent.

**Q22: What if the user sends SOL to themselves?**
> **Expected answer:** The transaction would succeed on Solana (it's a valid transfer), but the balance would remain the same minus the transaction fee. The code doesn't prevent this, but it's not harmful.
> **Key points:** Self-transfer behavior, fee implications.
> **Common mistake:** Saying "it would fail" — it succeeds but is wasteful.

### Improvement Questions

**Q23: What would you improve if you had more time?**
> **Expected answer:** (1) Add `--network` flag for devnet/testnet/mainnet selection, (2) Add transaction history display, (3) Support SPL token transfers, (4) Add encrypted keystore for persistence, (5) Write proper unit tests, (6) Add CI/CD pipeline, (7) Stop displaying secret key in terminal.
> **Key points:** Concrete, prioritized improvements.
> **Common mistake:** Saying "I'd rewrite everything" — show thoughtful prioritization.

**Q24: What would you do differently next time?**
> **Expected answer:** I'd use dependency injection for testability from the start, add a logging framework, and set up testing infrastructure before writing business logic.
> **Key points:** Learning from the experience, concrete changes.
> **Common mistake:** Saying "nothing" — always show growth mindset.

---

## 14. Tough Follow-Up Questions

### Chain 1: Technology Choices

**Q:** "Why did you use TypeScript?"
**→** "Why not plain JavaScript?"
**→** "But TypeScript adds compilation overhead — isn't that a problem for a CLI tool?"
**→** "How much slower is TypeScript compilation compared to running JavaScript directly?"

**Answer chain:** TypeScript adds negligible overhead with Bun (which handles TS natively), and the type safety catches bugs that would otherwise appear at runtime. For a CLI tool that handles cryptographic keys and financial transactions, type safety is especially valuable.

### Chain 2: Solana vs Ethereum

**Q:** "Why Solana and not Ethereum?"
**→** "What are the trade-offs between Solana and Ethereum?"
**→** "How would your code change if you ported this to Ethereum?"
**→** "Would ethers.js be a drop-in replacement for @solana/web3.js?"

**Answer chain:** Solana uses Ed25519 (faster) vs Ethereum's ECDSA. The transaction model is different (Solana uses separate fee payer vs Ethereum's gas-from-sender). The SDK APIs differ significantly — `ethers.js` is not a drop-in replacement. The core concepts (keypairs, transactions, RPC) are similar but the implementations differ.

### Chain 3: Security Deep Dive

**Q:** "How is the private key stored?"
**→** "What if someone accesses the machine while the CLI is running?"
**→** "How would you encrypt the key at rest?"
**→** "Would you use AES-256? How would you derive the encryption key?"
**→** "What about key derivation functions like PBKDF2 or Argon2?"

**Answer chain:** Currently, the key is in memory only. If the machine is compromised while running, the key is exposed. For encryption at rest, I'd use AES-256-GCM with a password-derived key using Argon2 (modern, memory-hard KDF) or PBKDF2. The encrypted key would be stored in a local file with the password required at startup.

### Chain 4: Transaction Reliability

**Q:** "What happens if the network is slow and the transaction doesn't confirm?"
**→** "How does the blockhash expiration work?"
**→** "Would you implement automatic retry logic?"
**→** "How would you handle duplicate transaction prevention?"
**→** "What is Solana's deduplication mechanism?"

**Answer chain:** The blockhash is valid for ~60-90 seconds. If it expires, the transaction is rejected. I would implement retry with a fresh blockhash. Solana deduplicates transactions by signature — resubmitting the same transaction with the same blockhash would be rejected. A new blockhash requires a new transaction.

### Chain 5: Architecture Scalability

**Q:** "What if you needed to support multiple wallets simultaneously?"
**→** "How would you refactor the Wallet class?"
**→** "Would you use a wallet manager or registry pattern?"
**→** "How would you handle concurrent transactions from multiple wallets?"

**Answer chain:** I'd create a `WalletManager` class that holds a `Map<publicKey, Wallet>`. Each wallet would have its own `Connection` or share one (Solana connections are thread-safe). Concurrent transactions would be serialized (Solana doesn't support parallel transactions from the same account) or queued.

### Chain 6: Key Format Compatibility

**Q:** "Why do you support both base58 and base64?"
**→** "What other formats exist?"
**→** "How would you add support for JSON keystore files (like Ethereum's UTC/JSON)?"
**→** "What encryption would you use for the JSON keystore?"

**Answer chain:** Other formats include raw hex, JSON keystores (Ethereum standard), and hardware wallet exports. For JSON keystore support, I'd follow the Web3 Secret Storage Definition (EIP-2335 for Solana adaptation) with scrypt or PBKDF2 key derivation and AES-128-CTR encryption.

### Chain 7: Error Handling

**Q:** "How do you handle errors?"
**→** "What about unhandled promise rejections?"
**→** "How would you add structured logging?"
**→** "Would you use a library like Winston or Pino?"

**Answer chain:** Currently, errors are caught with try/catch in the main flow and displayed with `log.error()`. Unhandled rejections from the async main function would crash the process. I'd add a global error handler, and for production, I'd use Pino (fast, structured JSON logging) with log levels and file output.

### Chain 8: Testing Strategy

**Q:** "How would you test this application?"
**→** "How do you test blockchain interactions without using real SOL?"
**→** "What is a Solana test validator?"
**→** "Would you mock the RPC calls?"

**Answer chain:** I'd use Solana's `solana-test-validator` for integration tests (local blockchain). For unit tests, I'd mock the `Connection` class. Key test scenarios: keypair import (all formats), balance display, transaction construction, error handling for invalid inputs.

### Chain 9: CLI UX

**Q:** "Why @clack/prompts and not inquirer?"
**→** "What makes a good CLI experience?"
**→** "How would you add keyboard shortcuts?"
**→** "Would you consider building a TUI (terminal UI) with something like blessed?"

**Answer chain:** @clack/prompts is modern, TypeScript-native, and produces clean output. Good CLI UX means clear prompts, validation feedback, progress indicators, and graceful cancellation. For a richer TUI, blessed or Ink (React for CLIs) would add complexity that isn't justified for this use case.

### Chain 10: Production Readiness

**Q:** "Is this production-ready?"
**→** "What would you need to make it production-ready?"
**→** "How would you handle secret management in production?"
**→** "Would you use environment variables or a vault?"

**Answer chain:** No, this is a development/learning tool. For production: (1) never display private keys, (2) add encrypted keystore, (3) implement proper logging, (4) add tests, (5) handle network failures gracefully, (6) add transaction limits. For secrets: environment variables for RPC endpoints, but private keys should never be in env vars — use a secure enclave or hardware wallet.

### Chain 11: Gas/Fees

**Q:** "Who pays the transaction fee?"
**→** "What happens if the fee payer has insufficient funds?"
**→** "How does Solana calculate transaction fees?"
**→** "Can you set a custom priority fee?"

**Answer chain:** The fee payer is always the sender (set via `transaction.feePayer`). If insufficient funds, the transaction is rejected before broadcast. Solana base fee is 5000 lamports per signature. Priority fees (compute unit prices) can be added via `ComputeBudgetProgram.setComputeUnitPrice()` — I'd add this for production to speed up confirmation.

### Chain 12: Cross-Chain

**Q:** "Could you extend this to support other blockchains?"
**→** "How would you abstract the blockchain layer?"
**→** "What interface would you create?"
**→** "How would you handle different signature schemes?"

**Answer chain:** I'd create an `IBlockchainWallet` interface with `getBalance()`, `send()`, `getAddress()`. Each blockchain (Solana, Ethereum, Bitcoin) would implement this interface. Signature scheme differences would be handled by each implementation — Ed25519 for Solana, ECDSA for Ethereum. The CLI layer would be blockchain-agnostic.

### Chain 13: Offline Signing

**Q:** "Could you support offline transaction signing?"
**→** "How would that work?"
**→** "What data would need to be transferred between online and offline machines?"
**→** "How would you serialize the signed transaction?"

**Answer chain:** Yes — the offline machine would construct and sign the transaction (using a manually provided blockhash), serialize it to base64, and transfer it to an online machine. The online machine would deserialize and broadcast it via `sendRawTransaction`. This is a legitimate security pattern for high-value wallets.

### Chain 14: Multi-Signature

**Q:** "Could you support multi-signature wallets?"
**→** "How does multi-sig work on Solana?"
**→** "What library would you use?"
**→** "How does it change the transaction flow?"

**Answer chain:** Solana supports multi-sig via the SPL Token Multisig program or custom programs. The transaction would need N-of-M signatures before broadcast. This would require changes to `sendSol()` to accept multiple signers and a signing phase before the send phase.

### Chain 15: Performance

**Q:** "Where are the performance bottlenecks?"
**→** "How would you optimize balance fetching?"
**→** "Would you cache balances?"
**→** "How long would you cache for?"

**Answer chain:** The main bottleneck is RPC round-trip latency. I'd cache balances for 5-10 seconds (Solana block time is ~400ms, so 5s covers ~12 blocks). I'd use a simple in-memory cache with TTL. For multiple balance checks, I'd batch them with `getMultipleBalances()`.

### Chain 16: Code Quality

**Q:** "How do you ensure code quality?"
**→** "What linting rules do you use?"
**→** "How does Prettier help?"
**→** "Would you add ESLint?"

**Answer chain:** Prettier enforces consistent formatting (4-space tabs, semicolons, double quotes). I'd add ESLint with `@typescript-eslint` for code quality rules (no-unused-vars, prefer-const, etc.). Combined, they catch style issues and potential bugs.

### Chain 17: Deployment

**Q:** "How would you distribute this tool?"
**→** "How does `bun link` work?"
**→** "Would you publish to npm?"
**→** "How would you handle versioning?"

**Answer chain:** `bun link` creates a global symlink so `zsol` is available as a command anywhere. For wider distribution, I'd publish to npm with semantic versioning. Users could then `npm install -g zsol` or `bun add -g zsol`. I'd add a CHANGELOG and use conventional commits.

### Chain 18: Graceful Degradation

**Q:** "What if the Solana network is congested?"
**→** "How would you handle transaction timeouts?"
**→** "Would you implement exponential backoff?"
**→** "How would you notify the user?"

**Answer chain:** I'd add retry logic with exponential backoff (1s, 2s, 4s, max 3 retries). The spinner would show retry count. If all retries fail, display a clear error with the transaction signature so the user can check it on a block explorer. I'd also add a `--timeout` flag.

### Chain 19: Internationalization

**Q:** "Could you support multiple languages?"
**→** "How would you implement i18n?"
**→** "Would you extract all strings?"
**→** "What library would you use?"

**Answer chain:** Yes — I'd extract all user-facing strings into a messages object, use a key-based lookup system, and support language selection at startup. For a CLI, a lightweight approach with JSON message files would work better than a heavy i18n library.

### Chain 20: Monitoring

**Q:** "How would you monitor this in production?"
**→** "What metrics would you track?"
**→** "Would you add analytics?"
**→** "How would you handle crash reporting?"

**Answer chain:** I'd track: RPC call latency, transaction success/failure rates, common errors. For analytics, I'd add opt-in telemetry (with clear privacy disclosure). For crash reporting, I'd catch unhandled errors and write them to a local log file. I would NOT add remote analytics without user consent.

---

## 15. "Why Did You Choose This Technology?"

### TypeScript

**Answer:**
"TypeScript gives me type safety, which is critical when handling cryptographic keys and financial transactions where a single type error could mean losing funds. Features like `private` access modifiers, typed parameters, and strict mode help catch bugs at compile time. The codebase uses strict mode in tsconfig.json, which catches null/undefined errors."

**If interviewer asks "Why not Java/Spring?":**
"For a CLI tool, Java would be overkill — the startup time, boilerplate, and JVM dependency would make it a poor fit. TypeScript with Bun gives me fast startup, native TS execution, and a much smaller footprint. Spring is designed for web services, not CLI tools."

### Bun

**Answer:**
"Bun is a fast JavaScript/TypeScript runtime that natively executes TypeScript without a build step. It also has a built-in package manager that's significantly faster than npm. For a CLI tool, fast startup matters — `bun run index.ts` starts instantly without compilation."

**If interviewer asks "Why not Node.js?":**
"Node.js would work, but it requires either a build step (tsc) or a runtime loader (ts-node/tsx) to execute TypeScript. Bun handles TypeScript natively. The performance difference for a small CLI is negligible, but the developer experience is better with Bun."

### @solana/web3.js

**Answer:**
"It's the official Solana JavaScript SDK, maintained by the Solana team. It provides a complete API for interacting with Solana: creating connections, building transactions, managing keypairs, and querying blockchain state. Using the official SDK ensures compatibility and access to the latest features."

**If interviewer asks "Why not @solana/web3.js v2 (new rewrite)?":**
"The v2 SDK has a different API and was still stabilizing when I built this. I chose v1 (1.98.4) because it's mature, well-documented, and has a straightforward API. For a new project today, I'd evaluate v2 for its smaller bundle size and tree-shaking support."

### @clack/prompts

**Answer:**
"@clack/prompts is a modern CLI prompt library with a clean API. It provides typed prompts (text, confirm, select), built-in spinners, cancel handling via `isCancel()`, and beautiful terminal output. It's lighter than inquirer and TypeScript-native."

**If interviewer asks "Why not inquirer?":**
"Inquirer is more established but heavier and has a more complex API. @clack/prompts was designed for modern TypeScript projects and provides a simpler, more ergonomic API for the features I needed — text input, confirmation, selection, and spinners."

### tweetnacl

**Answer:**
"tweetnacl is a JavaScript implementation of the NaCl cryptography library. I use it for Ed25519 key pair derivation from seed bytes via `nacl.sign.keyPair.fromSeed()`. It's a lightweight, well-audited library that's commonly used in the Solana ecosystem."

### bs58

**Answer:**
"bs58 provides base58 encoding and decoding. I use it to decode Phantom wallet exports, which use base58 format for private keys. It's a small, focused library with no unnecessary dependencies."

---

## 16. Scalability Questions

### What happens if users increase 10x?

**Currently implemented:**
Each CLI instance is independent — there's no server, no shared state, no database. 10x more users means 10x more independent connections to Solana RPC.

**What I would implement in production:**
- Use a **private RPC endpoint** (e.g., Helius, QuickNode) instead of the public devnet endpoint to avoid rate limiting.
- Add **request batching** for multiple balance queries.
- Implement **connection pooling** if converting to a server-based architecture.

### How would you improve performance?

**Currently implemented:**
Each operation makes a fresh RPC call. No caching.

**What I would implement in production:**
- **Balance caching** with 5-10 second TTL (Solana produces blocks every ~400ms).
- **Connection reuse** — create the `Connection` once and reuse it (already done via `ConnectionManager`).
- **Lazy initialization** of the connection (only connect when first needed).

### Where could bottlenecks occur?

1. **RPC latency** — public endpoints have rate limits and variable latency.
2. **Transaction confirmation** — Solana confirmation can take 1-5 seconds depending on network load.
3. **Blockhash expiration** — if the network is congested, blockhashes expire before transactions can be confirmed.

**Mitigation:** Use private RPC, implement retry logic, add priority fees for faster confirmation.

### How would you scale the backend?

**Currently:** There is no backend — the CLI runs entirely on the user's machine.

**If converting to a web service:** I'd add a REST API layer (Express/Fastify), implement rate limiting, add a connection pool for Solana RPC, and use a queue (Bull/BullMQ with Redis) for transaction processing.

### Would you use caching?

**Currently implemented:** No caching.

**Recommended:** Yes — for balance queries (cache for 5-10 seconds), recent blockhashes (cache for 10 seconds), and possibly transaction status (cache for 30 seconds). A simple in-memory Map with TTL would suffice for a CLI tool.

### Would you use Redis?

**For this CLI tool:** No — Redis adds infrastructure complexity that isn't justified.

**For a web service version:** Yes — Redis would be ideal for caching balances, storing session data, and queuing transactions in a multi-user deployment.

### How would you handle concurrent requests?

**Currently:** Each CLI instance is single-threaded and sequential (one operation at a time in the while loop). This is appropriate for a CLI tool.

**If needed:** I'd use `Promise.all()` for independent operations (e.g., fetching balance + checking network status simultaneously) or a worker pool for CPU-intensive operations.

### How would you handle failures?

**Currently implemented:** `try/catch` in `sendSol()` catches and displays transaction errors. Balance errors are not caught (they would propagate to the main loop).

**What I would implement:**
- Global error handler for unhandled promise rejections.
- Retry logic with exponential backoff for transient RPC failures.
- Graceful degradation: if balance fetch fails, show "unable to fetch" instead of crashing.
- Transaction failure recovery: suggest the user check the transaction on a block explorer.

### How would you monitor the application?

**Currently implemented:** No monitoring — errors are displayed in the terminal.

**What I would implement:**
- Structured logging with Pino (JSON format, log levels).
- Metrics: RPC call latency, transaction success rate, error rates.
- Optional telemetry (opt-in) for usage analytics.
- Crash reporting: capture unhandled errors to a local log file.

---

## 17. Testing & Debugging

### Existing Tests

**Status: Minimal.** The file `test.ts` contains a simple manual test:

```typescript
const connectionManager = new ConnectionManager();
const wallet = new Wallet(connectionManager, null);
console.log(wallet.getPrivateKey);
```

This creates a new wallet and prints the private key — useful for verifying keypair generation but not a proper test.

### Testing Approach (What I Would Implement)

| Test Type | Tool | What to Test |
|---|---|---|
| Unit Tests | Bun test runner | `keypairFromString()` with all formats (base58, base64, 32-byte, 64-byte, invalid) |
| Unit Tests | Bun test runner | `Wallet.getBalance()` with mocked connection |
| Unit Tests | Bun test runner | `Wallet.sendSol()` with mocked connection |
| Integration Tests | `solana-test-validator` | Full flow: create wallet, check balance, send SOL on local validator |
| E2E Tests | Manual or scripted | Full CLI flow with simulated user input |

### API Testing

The project calls Solana RPC endpoints. Testing would involve:
- **Unit:** Mock `Connection` class methods (`getBalance`, `sendRawTransaction`, etc.)
- **Integration:** Use `solana-test-validator` (Solana's local test blockchain) for real RPC calls without spending real SOL.

### Logging

**Currently:** `@clack/prompts` `log.info()`, `log.success()`, `log.error()`, `log.message()` for colored terminal output.

**Improvement:** Add structured logging with log levels (debug, info, warn, error) and optional file output.

### Error Handling

**Currently implemented:**
- `try/catch` in `sendSol()` catches transaction errors.
- `validate` callbacks in prompts catch invalid inputs.
- `isCancel()` handles prompt cancellation gracefully.

**Not implemented:**
- Global error handler for unhandled promise rejections.
- Retry logic for transient failures.
- Timeout handling for slow RPC calls.

### Debugging Approach

The current debugging approach is:
1. Run `bun run index.ts` and interact with the CLI.
2. Use `console.log()` (as seen in `test.ts`) for inspecting values.
3. Add breakpoints if using a debugger.

**Improvement:** Add a `--verbose` flag that enables debug logging (RPC calls, raw responses, timing).

### "How would you test this application?" — Interview Answer

"I would use three levels of testing. For unit tests, I'd test `keypairFromString()` with all supported formats — base58, base64, 32-byte seeds, 64-byte keys, and invalid inputs. I'd mock the Solana `Connection` class to test `Wallet.getBalance()` and `Wallet.sendSol()` without making real RPC calls. For integration tests, I'd use Solana's `solana-test-validator` — a local blockchain that runs on your machine — to test the full flow: create wallet, check balance, send SOL. This lets me test real blockchain interactions without spending real SOL."

---

## 18. Deployment & Production

### Currently Implemented

| Aspect | Status | Details |
|---|---|---|
| **Runtime** | Bun | `#!/usr/bin/env bun` shebang in `index.ts` |
| **Installation** | `bun install` + `bun link` | Links CLI globally as `zsol` command |
| **Network** | Solana devnet | Default via `clusterApiUrl("devnet")` |
| **Package management** | `bun.lock` | Lockfile for reproducible installs |
| **Code formatting** | Prettier | `.prettierrc` + VSCode format-on-save |
| **TypeScript** | Strict mode | `tsconfig.json` with comprehensive strict flags |
| **Environment variables** | Not used | No `.env` file, no `process.env` references |
| **Build process** | None needed | Bun executes TypeScript directly |
| **Docker** | Not present | — |
| **CI/CD** | Not present | — |
| **Hosting** | N/A | CLI runs locally |

### Production Improvements

1. **Network selection:** Add `--network` flag for devnet/testnet/mainnet.
2. **Private RPC endpoint:** Use Helius, QuickNode, or Triton instead of public endpoint.
3. **Encrypted keystore:** Store encrypted keys locally with password protection.
4. **CI/CD pipeline:** GitHub Actions for linting, type checking, and testing on push.
5. **npm publishing:** Publish as a globally installable package.
6. **Docker:** Create a Dockerfile for containerized usage.
7. **Logging:** Add structured logging with file output.
8. **Secret management:** Never display private keys; use environment variables for RPC URLs.
9. **Versioning:** Semantic versioning with CHANGELOG.
10. **Error monitoring:** Crash reporting and usage analytics (opt-in).

---

## 19. Weaknesses & Limitations

### Weakness 1: Secret Key Displayed in Terminal

**Problem:** The secret key is printed to stdout as part of the wallet loading flow. Anyone who can see the terminal (screen recording, shoulder surfing, log files) could steal the wallet.

**Why it matters:** This is a critical security issue for any wallet handling real funds.

**How I would improve it:** Never display the secret key. Instead, offer an encrypted export option or let the user back up during initial creation with a confirmation step.

### Weakness 2: No Persistent Storage

**Problem:** The user must re-import their private key every time they run the CLI.

**Why it matters:** Inconvenient for regular use. Users might resort to unsafe workarounds (pasting keys into shell history).

**How I would improve it:** Add an optional encrypted keystore (similar to Ethereum's UTC/JSON format) that stores the key locally, protected by a password.

### Weakness 3: No Transaction History

**Problem:** Users can only see their current balance, not past transactions.

**Why it matters:** Without transaction history, users can't verify past activity or troubleshoot failed transactions.

**How I would improve it:** Add a `getTransactionHistory()` method using `connection.getSignaturesForAddress()` and display results in a formatted table.

### Weakness 4: No Retry Logic for Failed Transactions

**Problem:** If a transaction fails (network timeout, blockhash expiration), the user must manually retry.

**Why it matters:** Blockchain transactions can fail for transient reasons, and manual retry is error-prone.

**How I would implement it:** Add automatic retry with exponential backoff (1s, 2s, 4s, max 3 retries) and a fresh blockhash for each attempt.

### Weakness 5: No Input Sanitization for Shell Injection

**Problem:** While `@clack/prompts` handles input safely, the `validate` callbacks use basic checks. Edge cases in public key or amount validation could potentially cause unexpected behavior.

**Why it matters:** Robust input validation is critical for a financial tool.

**How I would improve it:** Add stricter validation with schema validation library (e.g., Zod), test edge cases thoroughly.

### Weakness 6: No Support for SPL Tokens

**Problem:** The wallet can only transfer SOL, not SPL tokens (USDC, etc.).

**Why it matters:** Most real-world Solana usage involves SPL tokens.

**How I would improve it:** Add SPL token transfer support using `@solana/spl-token`.

### Weakness 7: No Multi-Network Support

**Problem:** Hardcoded to devnet. Users cannot connect to testnet or mainnet without modifying the code.

**Why it matters:** Limits the tool's usefulness for testing on different networks.

**How I would improve it:** Add `--network` CLI flag or a menu option to switch networks.

### Weakness 8: Basic Error Handling

**Problem:** Only `sendSol()` has a try/catch. Balance fetch errors are not handled. No global error handler.

**Why it matters:** Unhandled errors could crash the CLI unexpectedly.

**How I would improve it:** Add try/catch around all async operations, implement a global error handler, and add user-friendly error messages.

---

## 20. Questions I Should Ask the Interviewer

1. **"What does the team's development workflow look like — do you use feature branches, pair programming, or code reviews?"**
   *Shows interest in collaboration and code quality.*

2. **"What's the most technically challenging project the team is currently working on?"**
   *Shows ambition and interest in complex problems.*

3. **"How does the team handle testing and code quality — is there a CI/CD pipeline?"**
   *Shows awareness of best practices.*

4. **"What technologies is the team exploring or planning to adopt?"**
   *Shows forward-thinking and adaptability.*

5. **"How is the codebase structured — monolith, microservices, or something else?"**
   *Shows architectural awareness.*

6. **"What does the onboarding process look like for a new intern?"**
   *Shows practical thinking about ramping up.*

7. **"How do you handle production incidents — is there an on-call rotation or incident response process?"**
   *Shows maturity and awareness of production concerns.*

8. **"What's the biggest technical debt the team is currently managing?"**
   *Shows understanding that all codebases have trade-offs.*

---

## 21. Final Rapid Revision

### Project One-Liner
A lightweight CLI wallet for the Solana blockchain built with TypeScript and Bun, enabling keypair management, balance checking, and SOL transfers from the terminal.

### Tech Stack
TypeScript + Bun + @solana/web3.js + @clack/prompts + tweetnacl + bs58

### Architecture
```
CLI (index.ts) → Wallet (wallet.ts) → ConnectionManager (connection.ts) → Solana RPC
Utility: keypairFromString (utils.ts)
```

### Main Features
1. Keypair generation and import (base58/base64)
2. Balance display
3. SOL transfer with confirmation
4. Interactive CLI with spinners

### Database
**None.** All state is on the Solana blockchain.

### Authentication
**None.** CLI tool, no server, no user accounts.

### 5 Important APIs (RPC Calls)
1. `connection.getBalance(publicKey)` — fetch wallet balance
2. `connection.getLatestBlockhash()` — get recent blockhash for signing
3. `connection.sendRawTransaction(serialized)` — broadcast signed transaction
4. `connection.confirmTransaction(params)` — wait for on-chain confirmation
5. `SystemProgram.transfer({from, to, lamports})` — create transfer instruction

### 5 Important Technical Concepts
1. **Ed25519 keypairs** — public/private key cryptography used by Solana
2. **Base58/Base64 encoding** — different formats for representing binary keys
3. **Transaction lifecycle** — construct → sign → serialize → send → confirm
4. **Blockhash freshness** — transactions must use recent blockhashes to prevent replay
5. **Lamports vs SOL** — smallest unit conversion (1 SOL = 10^9 lamports)

### 5 Difficult Problems
1. Supporting multiple private key formats (base58, base64, 32-byte, 64-byte)
2. Transaction construction with proper signing and confirmation
3. Ed25519 keypair derivation from seed bytes
4. Error handling for transient blockchain failures
5. Security of private key handling in a CLI context

### 10 Likely Interview Questions
1. "Explain your project." → See Section 2
2. "How does the keypair import work?" → Decoder chain, byte length handling
3. "Walk me through sending a SOL transaction." → 5-step lifecycle
4. "Why TypeScript?" → Type safety for crypto/financial code
5. "Why Solana?" → Fast, low fees, Ed25519
6. "How is the private key stored?" → Memory only, never persisted
7. "What would you improve?" → Encrypted keystore, retry logic, tests
8. "How would you test this?" → Unit mocks + solana-test-validator
9. "What happens if the RPC is down?" → Error handling, retry logic
10. "How does the architecture work?" → 4-file separation of concerns

### 5 Important Trade-offs
1. **Base58-first decoder** (user-friendly) vs **explicit format flag** (less magical)
2. **In-memory keys** (secure) vs **encrypted keystore** (convenient)
3. **Bun** (fast, modern) vs **Node.js** (mature, wider ecosystem)
4. **@clack/prompts** (clean, modern) vs **inquirer** (established, more features)
5. **No database** (simple, stateless) vs **Local SQLite** (persistent history)

### 5 Things I Should Never Incorrectly Claim
1. ❌ "It has a web frontend" — it's CLI only
2. ❌ "It uses a database" — all state is on-chain
3. ❌ "It has user authentication" — no server, no accounts
4. ❌ "It supports mainnet by default" — it's hardcoded to devnet
5. ❌ "It stores private keys securely on disk" — keys are memory-only

---

## 22. Interview Cheat Sheet

### 10 Minutes Before the Interview

- **Project:** ZSol — Solana CLI wallet, TypeScript + Bun
- **Stack:** TypeScript, Bun, @solana/web3.js, @clack/prompts, tweetnacl, bs58
- **Files:** `index.ts` (CLI), `wallet.ts` (Wallet class), `connection.ts` (RPC), `utils.ts` (key parsing)
- **No database, no server, no auth** — blockchain is the data store

### Key Technical Points
- `keypairFromString()`: base58 try → base64 fallback → 32-byte seed (derive) or 64-byte key (direct)
- `sendSol()`: construct TX → set feePayer + blockhash → sign → serialize → sendRawTransaction → confirm
- `getBalance()`: RPC call → lamports → divide by LAMPORTS_PER_SOL
- Connection to **devnet** via `clusterApiUrl("devnet")`
- Private key: **memory only**, never persisted

### Buzzwords to Use
- Separation of concerns, Single Responsibility Principle
- Asynchronous programming, async/await
- Type safety, strict TypeScript
- Cryptographic keypairs, Ed25519
- Transaction lifecycle, blockhash freshness
- Input validation, error handling
- CLI UX: spinners, prompts, confirmation flows

### Weaknesses to Acknowledge Honestly
1. No tests (manual test only)
2. Secret key displayed in terminal
3. No persistent storage
4. No retry logic
5. Devnet only (no mainnet support)
6. SOL only (no SPL tokens)

### Power Move
When asked "What would you improve?", give 3 prioritized items:
1. **Security:** Never display secret key, add encrypted keystore
2. **Reliability:** Add retry logic, better error handling, test coverage
3. **Features:** Transaction history, multi-network support, SPL token support

---

## TOP 15 Questions You MUST Be Able to Answer

| # | Question | Key Answer |
|---|---|---|
| 1 | "Explain your project." | CLI wallet for Solana — generate/import keys, check balance, send SOL. TypeScript + Bun + @solana/web3.js. |
| 2 | "How does keypair import work?" | Decoder chain: base58 → base64 fallback → 32-byte seed (Ed25519 derive) or 64-byte key (direct). |
| 3 | "Walk me through sending SOL." | Construct TX → SystemProgram.transfer → set feePayer + blockhash → sign → serialize → send → confirm. |
| 4 | "Why TypeScript?" | Type safety for crypto/financial code. Strict mode catches null/undefined. Private access modifiers. |
| 5 | "How is the private key stored?" | Memory only. Never written to disk. Lost when process exits. Security by design. |
| 6 | "Why Solana over Ethereum?" | Fast (~400ms blocks), low fees, Ed25519 (faster than ECDSA). |
| 7 | "What's the hardest problem?" | Supporting multiple key formats (base58/base64, 32/64-byte) with a robust decoder chain. |
| 8 | "How would you test this?" | Unit tests with mocked Connection + integration tests with solana-test-validator. |
| 9 | "What would you improve?" | Encrypted keystore, retry logic, transaction history, multi-network, tests. |
| 10 | "How does the architecture work?" | 4 files: CLI entry, Wallet class, ConnectionManager, key import utility. Clear SRP. |
| 11 | "Why Bun over Node.js?" | Native TS execution, faster startup, built-in package manager. |
| 12 | "What happens if RPC fails?" | Currently: error displayed. Improvement: retry with exponential backoff. |
| 13 | "Why no database?" | All state is on the Solana blockchain. CLI is stateless. |
| 14 | "How do you handle errors?" | try/catch for transactions, validate callbacks for inputs, isCancel for prompts. |
| 15 | "What security concerns exist?" | Secret key displayed in terminal (weakness), no encrypted storage, no transaction limits. |
