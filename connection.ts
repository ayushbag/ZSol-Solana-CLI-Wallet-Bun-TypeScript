import { clusterApiUrl, Connection } from "@solana/web3.js";

export class ConnectionManager {
    private _connection: Connection;

    constructor(rpcUrl: string = clusterApiUrl("devnet")) {
        this._connection = new Connection(rpcUrl)
    }

    get connection(): Connection {
        return this._connection
    }
}