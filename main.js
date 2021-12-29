const SHA256 = require("crypto-js/sha256");
var blocksMined = 0;
var currentBlockNumber = 2;

class Block {

    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;

    }

    calculateHash() {

        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();

    }

    mineBlock(difficulty) {

        

        console.log("Mining Block: " + currentBlockNumber + "....");

        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {

            this.nonce++;
            this.hash = this.calculateHash();

        }


        blocksMined++;
        currentBlockNumber++;
        let inSync = this.blockNumberCheck();
        console.log("Block mined: " + this.hash);
        console.log("Number of blocks mined: " + blocksMined);
        //console.log("Is blockchain valid?: " + Blockchain.isChainValid());
       
        if(inSync == false){

            currentBlockNumber = blocksMined
            currentBlockNumber++;

        }
        
       

    }

    blockNumberCheck(){

        let x = blocksMined;

        if(currentBlockNumber !== x + 1){

            return false;

        }

        return true;


    }



}


class Blockchain {

    constructor() {

        this.chain = [this.createGenesisBlock];
        this.difficulty = 4;



    }

    createGenesisBlock() {

        return new Block(0, "01/01/2021", "Genesis Block", "203042caf34a");

    }

    getLatestBlock() {

        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {

        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
        console.log("Is blockchain valid?: " + this.isChainValid());
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
Project_Bioticlab.addBlock(new Block(1, "12/29/2021", { amount: 4 }));
Project_Bioticlab.addBlock(new Block(2, "12/30/2021", { amount: 5 }));

//console.log("Is blockchain vaild?: " + Project_Bioticlab.isChainValid());

//console.log(JSON.stringify(Project_Bioticlab, null, 4));