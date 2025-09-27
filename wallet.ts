import {
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
} from "@solana/web3.js";
import { ConnectionManager } from "./connection";

export class Wallet {
    private _keypair: Keypair;
    private _connectionManager: ConnectionManager;

    constructor(
        connectionManager: ConnectionManager,
        keypair?: Keypair | null ,
    ) {
        this._connectionManager = connectionManager;
        this._keypair = keypair || Keypair.generate();
    }

    get getPublicKey(): string {
        return this._keypair.publicKey.toBase58();
    }

    get getPrivateKey(): string {
        return this._keypair.secretKey.toBase64();
    }

    get getPrivateKeyUInt8(): Uint8Array {
        return this._keypair.secretKey;
    }

    async getBalance(): Promise<number> {
        const connection = this._connectionManager.connection;
        const balance = await connection.getBalance(this._keypair.publicKey);
        return balance / LAMPORTS_PER_SOL;
    }

    async sendSol(
        receiverPubKey: PublicKey | string,
        amountInSol: number,
    ): Promise<string> {
        const connection = this._connectionManager.connection;
        const toPubKey =
            typeof receiverPubKey === "string"
                ? new PublicKey(receiverPubKey)
                : receiverPubKey;

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: this._keypair.publicKey,
                toPubkey: toPubKey,
                lamports: LAMPORTS_PER_SOL * amountInSol,
            }),
        );

        transaction.feePayer = this._keypair.publicKey;
        transaction.recentBlockhash = (
            await connection.getLatestBlockhash()
        ).blockhash;
        transaction.partialSign(this._keypair);

        const signature = await connection.sendRawTransaction(
            transaction.serialize(),
        );

        await connection.confirmTransaction({
            signature,
            blockhash: transaction.recentBlockhash,
            lastValidBlockHeight: (await connection.getLatestBlockhash())
                .lastValidBlockHeight,
        });

        return signature;
    }
}
