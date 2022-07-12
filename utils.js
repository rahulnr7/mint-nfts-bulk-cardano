import fs from "fs";


export async function dataCleanUpNftOffer(filePath) {
    const str = fs
      .readFileSync(filePath)
      .toString()
      .split(/\r?\n/)
      .filter((ele) => ele);
  
    str.shift();
    const strOut = str.join('\n');
  
    fs.writeFileSync(filePath, strOut);
  }