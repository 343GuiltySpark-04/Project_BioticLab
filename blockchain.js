const SHA256 = require("crypto-js/sha256");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
var blocksMined = 0;
var currentBlockNumber = 2;

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }

  calculateHash(){

    return SHA256(this.fromAddress + this.toAddress + this.amount).toString();


  }

  signTransaction(signingKey){

      if (signingKey.getPublic('hex') !== this.fromAddress){

        throw new Error('You cannot sign a transaction for other wallets');

      }

    const hashtx = this.calculateHash();
    const sig = signingKey.sign(hashtx, 'base64');
    this.signature = sig.toDER('hex');

  }


  isValid(){

    if (this.fromAddress === null) return true;

    if (!this.signature || this.signature.length === 0){

        throw new Error("No signature in this transaction!");

    }

    const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
    return publicKey.verify(this.calculateHash(), this.signature);

  }


}

class Block {
  constructor(timestamp, transactions, previousHash = "") {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.previousHash +
        this.timestamp +
        JSON.stringify(this.transactions) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    console.log("Mining Block: " + currentBlockNumber + "....");

    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }

  hasValidTransactions(){
    
    for(const tx of this.transactions){

        if(!tx.isValid()){

            return false;
        }


    }

    return true;

  }

}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  blockNumberCheck() {
    let x = blocksMined;

    if (currentBlockNumber !== x + 1) {
      return false;
    }

    return true;
  }

  createGenesisBlock() {
    return new Block("01/01/2021", "Genesis Block", "203042caf34a");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransaction(miningRewardAddress) {
    let block = new Block(
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock.hash
    );
    block.mineBlock(this.difficulty);

    blocksMined++;
    currentBlockNumber++;
    let inSync = this.blockNumberCheck();
    console.log("Block mined successfuly!");
    console.log("Number of blocks mined: " + blocksMined);
    this.chain.push(block);
    console.log("Is blockchain valid?: " + this.isChainValid());

    if (inSync == false) {
      currentBlockNumber = blocksMined;
      currentBlockNumber++;
    }

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward),
    ];
  }

  addTransaction(transaction) {

    if (!transaction.fromAddress || !transaction.toAddress){

        throw new Error('Transaction must include a to and from address!');


    }

    if(!transaction.isValid()){

        throw new Error('Cannot add invalid transactions to chain!');


    }

    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }

        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }

    return balance;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (!currentBlock.hasValidTransactions()){

        return false;

      }

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }
}

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;