import {submitMintBatch} from './mintMultipleNfts.js';
import * as utils from './utils.js';

const pfx = 'Punto_Ser'; // assetName Prefix. will be appended by 1,2,3,...
const description = 'An example description'; // description
const imageType = 'image/png'; // mediaType
const receiverAddr =
  'addr_test1qzcfmng20399yvz8l8l9ankalzkdcjcmv5qq9tpkrlsae48m2teht5hapc9njfr4gezpn282nnqwsd6th6y97xtt97cspth0xc'; //extnftbulk
var pvtKeyAddr = '';
const countOfNftsInTxn = 50;
const filePathIPFS = '/Users/rahulnair/projects/fibo-tools/outputs/log.txt';
const filePathKeyAddr = '/Users/rahulnair/projects/cardano-mint-nft/key_Addr.txt';

const lines = await utils.lineArr(filePathKeyAddr);

(async () => {
  for (var i = 0; i < lines.length; i++) {
    console.log(`\nMinting batch : ${i}, Series: ${pfx}${i}_`);
    var line = lines[i];
    line = line.substring(6, line.indexOf('Address:') - 1);
    console.log(`private key ${i}: ${line}`);
    pvtKeyAddr = line;

    var assetnamePfx = `${pfx}${i}_`;
    const minted = await submitMintBatch(
      assetnamePfx,
      description,
      imageType,
      receiverAddr,
      pvtKeyAddr,
      countOfNftsInTxn,
      filePathIPFS,
    );

    if (minted == true) await utils.dataCleanUpIpfsFileByCount(filePathIPFS, countOfNftsInTxn);
  }
})();
