const SHA256 = require("crypto-js/sha256");
var blocksMined = 0;
var currentBlockNumber = 2;

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
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
    let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock.hash);
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

  createTransaction(transaction) {
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

let Project_Bioticlab = new Blockchain();
Project_Bioticlab.createTransaction(new Transaction('address1', 'address2', 100));
Project_Bioticlab.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting the miner....');
Project_Bioticlab.minePendingTransaction('my-address');
console.log('\n Balance of account is: ', Project_Bioticlab.getBalanceOfAddress('my-address'));