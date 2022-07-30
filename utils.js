import fs from 'fs';

export async function dataCleanUpIpfsFile(filePath) {
  const str = fs
    .readFileSync(filePath)
    .toString()
    .split(/\r?\n/)
    .filter((ele) => ele);

  str.shift();
  const strOut = str.join('\n');

  fs.writeFileSync(filePath, strOut);
}

export async function addKeyAndAddressToFile(key, addr, filePath) {
  const logger = fs.createWriteStream(filePath, {flags: 'a+'});

  const data = fs.readFileSync(filePath);
  let str = '';
  // if (data.length == 0) {
  //   str = `Key : ${key} Address: ${addr}`;
  // } else {
  //   str = `\nKey : ${key} Address: ${addr}`;
  // }

  str = `Key : ${key} Address: ${addr}\n`;
  logger.write(str);
  // const writeLine = (line: string) => logger.write(`\n${line}`);
  // writeLine(assetName);
}

export async function dataCleanUpIpfsFileByCount(filePath, count) {
  const str = fs
    .readFileSync(filePath)
    .toString()
    .split(/\r?\n/)
    .filter((ele) => ele);

  for (var i = 0; i < count; i++) {
    str.shift();
  }
  const strOut = str.join('\n');
  fs.writeFileSync(filePath, strOut);
  console.log('\x1b[31m%s\x1b[0m', 'IPFS file deleted by 50')
}

export const lineArr = async (filePath) => {
  const str = fs
    .readFileSync(filePath)
    .toString()
    .split(/\r?\n/)
    .filter((ele) => ele);

  return str;
};

//dataCleanUpIpfsFileByCount('/Users/rahulnair/projects/cardano-mint-nft/log.txt', 5);
