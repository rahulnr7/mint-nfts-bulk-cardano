import fs from "fs";

//const filePath = "/Users/rahulnair/projects/cardano-mint-nft/log.txt";

const filePath = "/Users/rahulnair/projects/fibo-tools/outputs/log.txt";

export function createMetadata(policyId, assetNamePfx, description, mediaType ) {
  let metadataObj = {};  
  var array = fs.readFileSync(filePath).toString().split("\n");
  var countNFT = array.length;
  console.log('File Size : ', countNFT);

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

    objMain = { ...objMain, ...obj };

    metadataObj[policyId] = objMain;
  }

  //console.log(`METADATA: `, metadata);

  fs.writeFile("metadata.json", JSON.stringify(metadataObj, null, 2), (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });

  return {metadataObj, countNFT};
}

//creataMetadata(policyId1);
