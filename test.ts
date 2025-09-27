import { ConnectionManager } from "./connection";
import { Wallet } from "./wallet";

const connectionManager = new ConnectionManager();
const wallet = new Wallet(connectionManager, null)

console.log(wallet.getPrivateKey)