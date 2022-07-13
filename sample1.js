import fs from 'fs';

const filePath = '/Users/rahulnair/projects/cardano-mint-nft/log.txt';
var array = fs.readFileSync(filePath).toString().split('\n');
console.log(array.length);
for (let i = 0; i <= array.length; i++) {
  console.log(array[i]);
}
