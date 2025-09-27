import { Keypair } from "@solana/web3.js";
import bs58 from "bs58"
import nacl from "tweetnacl";

export function keypairFromString(privateKeyInput: string): Keypair {
    const sanitized = privateKeyInput.trim().replace(/\s+/g, "");

    let privateKeyBytes: Uint8Array;

    // Try base58 decode first (Phantom format)
    try {
        privateKeyBytes = bs58.decode(sanitized);
    } catch {
        // If base58 fails, try base64 decode
        try {
            privateKeyBytes = Buffer.from(sanitized, "base64");
        } catch {
            throw new Error(
                "Invalid private key format (not base58 or base64).",
            );
        }
    }

    if (privateKeyBytes.length === 32) {
        const kp = nacl.sign.keyPair.fromSeed(privateKeyBytes);
        return Keypair.fromSecretKey(
            Uint8Array.from([...privateKeyBytes, ...kp.publicKey]),
        );
    }

    if (privateKeyBytes.length === 64) {
        return Keypair.fromSecretKey(privateKeyBytes);
    }

    throw new Error(
        `Invalid private key length: ${privateKeyBytes.length} bytes (expected 32 or 64).`,
    );
}