const {Blockchain, Transaction} = require('./blockchain');

let Project_Bioticlab = new Blockchain();
Project_Bioticlab.createTransaction(new Transaction('address1', 'address2', 100));
Project_Bioticlab.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting the miner....');
Project_Bioticlab.minePendingTransaction('my-address');
console.log('\n Balance of account is: ', Project_Bioticlab.getBalanceOfAddress('my-address'));