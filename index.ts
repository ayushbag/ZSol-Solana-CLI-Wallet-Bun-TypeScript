#! /usr/bin/env bun
import { Keypair, PublicKey } from "@solana/web3.js";
import { Wallet } from "./wallet";
import { ConnectionManager } from "./connection";
import {
    intro,
    text,
    confirm,
    isCancel,
    cancel,
    log,
    select,
    spinner,
    outro,
} from "@clack/prompts";
import { keypairFromString } from "./utils";

async function main() {
    // introduction
    intro("Welcome to ZSol — a solana cli wallet🚀");

    // storing or generating keypair
    const haveKeyPair = await confirm({
        message: "Do you already have a keypair?",
    });

    let keypair: Keypair | null = null;

    if (haveKeyPair) {
        const privateKeyBase64 = await text({
            message: "Enter your private key (base58)",
            validate: (value) => {
                if (value.length == 0) {
                    return `private key is needed`;
                }
                try {
                    if (
                        Buffer.from(value, "base64").toString("base64") !==
                        value.replace(/\n|\r/g, "")
                    ) {
                        return "Invalid Base64 format";
                    }
                } catch {
                    return "Invalid Base64 format";
                }
            },
        });

        if (isCancel(privateKeyBase64)) {
            cancel("Operation cancelled.");
            process.exit(0);
        }

        keypair = keypairFromString(privateKeyBase64);
    }

    // now we have keypair or it will auto generate a new one
    const connectionManager = new ConnectionManager();
    const wallet = new Wallet(connectionManager, keypair);

    // print pubKey and secretKey
    if (keypair !== null) {
        log.success("✅ Wallet successfully loaded!");

        log.info("🔹 Public Key:");
        log.message(keypair.publicKey.toBase58());

        log.info("🔸 Secret Key (base64):");
        log.message(Buffer.from(keypair.secretKey).toString("base64"));

        log.warning(
            "⚠ Keep your secret key safe. Do NOT share it with anyone.",
        );
    } else {
        log.success("✅ Wallet successfully loaded!");

        log.info("🔹 Public Key:");
        log.message(wallet.getPublicKey);

        log.info("🔸 Secret Key (base64):");
        log.message(wallet.getPrivateKey);

        log.warning(
            "⚠ Keep your secret key safe. Do NOT share it with anyone.",
        );
    }

    while (true) {
        const task = await select({
            message: "What do you want to do?",
            options: [
                { value: "balance", label: "Show Balance" },
                { value: "send", label: "Send SOL" },
                { value: "exit", label: "Exit" },
            ],
        });

        if (isCancel(task)) {
            cancel("Operation cancelled.");
            process.exit(0);
        }

        if (task === "exit") {
            log.info("Exiting application.");
            process.exit(0);
        }

        const s = spinner({
            indicator: "dots",
        });

        if (task == "balance") {
            s.start("Fetching wallet balance...");
            const balance = await wallet.getBalance();
            log.info("Wallet Balance:");
            log.message(`${balance} SOL`);
            s.stop("✅ Balance fetched successfully!");
        }

        if (task == "send") {
            const receiverPubKey = await text({
                message: "Enter Receiver's public key:",
                validate: (value) => {
                    if (value.length == 0) {
                        return "No Input provided";
                    }
                    try {
                        new PublicKey(value);
                    } catch (error) {
                        return "Invalid Public Key";
                    }
                },
            });

            if (isCancel(receiverPubKey)) {
                cancel("Operation cancelled.");
                process.exit(0);
            }

            const amount = await text({
                message: "Enter Amount in SOL",
                validate: (value) => {
                    if (isNaN(parseFloat(value))) {
                        return "Amount should be a number";
                    }
                },
            });

            if (isCancel(amount)) {
                cancel("Operation cancelled.");
                outro("Thanks for using ZSol...! 🤍");
                process.exit(0);
            }
            const amountNumber = parseFloat(amount);

            const confirmDetails = await confirm({
                message: `Send ${String(amount)} SOL to ${String(receiverPubKey)} — Confirm?`,
            });

            if (confirmDetails) {
                try {
                    s.start("Processing your transaction...");
                    const signature = await wallet.sendSol(
                        receiverPubKey,
                        amountNumber,
                    );
                    log.success(
                        `Transaction successful! Signature: ${signature}`,
                    );
                    s.stop("✅ Transaction confirmed!");
                } catch (err) {
                    log.error(`Transaction failed: ${err}`);
                }
            } else {
                log.info("Transaction cancelled.");
            }
        }
    }
}

main();
