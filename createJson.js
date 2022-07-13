import fs from 'fs';
import * as utils from './utils.js';
import path from 'path';

const filePath = '/Users/rahulnair/projects/fibo-tools/outputs/log.txt';

export async function createMetadata(countNFT, policyId, assetNamePfx, description, mediaType) {
  let metadataObj = {};

  var data = fs.readFileSync(filePath);

  if (data.length == 0) {
    console.log('IPFS text file is empty. Finishing Process.');
    process.exit(100);
  }
  var array = data.toString().split('\n');

  var countLine = array.length;
  //var countNFT = 6;

  if (countLine < countNFT) {
    countNFT = countLine;
  }
  console.log('Number of Nfts in metadata Json : ', countNFT);

  for (let i = 0; i < countNFT; i++) {
    let ipfs = array[i];
    let assetName = `${assetNamePfx}${i}`;

    const obj = {
      [assetName]: {
        name: assetName,
        description: description,
        image: ipfs,
        mediaType,
      },
    };

    let objMain = metadataObj[policyId];

    objMain = {...objMain, ...obj};

    metadataObj[policyId] = objMain;

    //await utils.dataCleanUpIpfsFile(filePath);
  }

  //console.log(`METADATA: `, metadata);

  fs.writeFile('metadata.json', JSON.stringify(metadataObj, null, 2), (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });

  return {metadataObj, countNFT};
}

//createMetadata('Rahul', 'kallu', 'malal', 'lala' );
