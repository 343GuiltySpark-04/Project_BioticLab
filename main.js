const SHA256 = require("crypto-js/sha256");

class block {

    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();

    }

    calculateHash() {

        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();

    }




}


class Blockchain {

    constructor() {

        this.chain = [this.createGenesisBlock];




    }

    createGenesisBlock() {

        return new block(0, "12/29/2021", "Genesis Block", "203042caf34a");

    }

}