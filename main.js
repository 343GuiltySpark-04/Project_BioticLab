const { Blockchain, Transaction } = require("./blockchain");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

const myKey = ec.keyFromPrivate(
  "b11af8da4f6c6912cf12007d7f30f85976c131f031d1cd69142c62e82ac422bf"
);
const myWalletAddress = myKey.getPublic("hex");
const targetAddress = "";
const amountToSend = 5;

let Project_Bioticlab = new Blockchain();

Project_Bioticlab.minePendingTransaction(myWalletAddress);

const txl = new Transaction(myWalletAddress, "targetAddress", amountToSend);
txl.signTransaction(myKey);
Project_Bioticlab.addTransaction(txl);

console.log("\n Starting the miner....");
Project_Bioticlab.minePendingTransaction(myWalletAddress);
console.log(
  "\n Balance of account is: ",
  Project_Bioticlab.getBalanceOfAddress(myWalletAddress)
);
