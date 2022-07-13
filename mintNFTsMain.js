import {submitMintBatch} from './mintMultipleNfts.js';
import * as utils from './utils.js';

const pfx = 'OZ_Ser'; // assetName Prefix. will be appended by 1,2,3,...
const description = 'An example description'; // description
const imageType = 'image/png'; // mediaType
const receiverAddr =
  'addr_test1qq5vsh0jmf8wws5lmds77fuq06jf4vummsmkyq5azjfsc6wg42pclf2zm5csxpfnxl8xctuv5dvy5r9lpx4hhn4v354sz5x6na'; //receiver address//test1 wallet
var pvtKeyAddr = '';
const countOfNftsInTxn = 50;
const filePathIPFS = '/Users/rahulnair/projects/fibo-tools/outputs/log.txt';
const filePathKeyAddr = '/Users/rahulnair/projects/cardano-mint-nft/key_Addr.txt';

const lines = await utils.lineArr(filePathKeyAddr);

// for (var i=1 ; i<3 ; i++){

//   await submitMintBatch(assetnamePfx, description, imageType, receiverAddr, pvtKeyAddr, countOfNftsInTxn, filePathIPFS);

//   await utils.dataCleanUpIpfsFileByCount(filePathIPFS, countOfNftsInTxn);

// }
(async () => {
  for (var i = 0; i < lines.length; i++) {
    console.log('\nMinting batch : ', i);
    var line = lines[i];
    line = line.substring(6, line.indexOf('Address:') - 1);
    console.log(`private key ${i}: ${line}`);
    pvtKeyAddr = line;

    var assetnamePfx = `${pfx}${i}_`;
    await submitMintBatch(
      assetnamePfx,
      description,
      imageType,
      receiverAddr,
      pvtKeyAddr,
      countOfNftsInTxn,
      filePathIPFS,
    );

    await utils.dataCleanUpIpfsFileByCount(filePathIPFS, countOfNftsInTxn);
  }
})();
