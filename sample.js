import CardanoWasm, { SingleHostAddr } from "@emurgo/cardano-serialization-lib-nodejs";
import cbor from "cbor";
import fs from "fs";
import events from 'events';
import readline  from 'readline';
import path from 'path';


try {
  
    const privateKey = CardanoWasm.PrivateKey.from_normal_bytes(
     cbor.decodeFirstSync(
       "58209da681125617618d533b3cedb7491d039cd84daa3c59aff66c9c436825204d40"
     )
   );
 
   console.log(`PRIVATE KEY: ${privateKey.to_bech32()}`);
 
   // import policy key from a .skey file
   const policyPrivateKey = CardanoWasm.PrivateKey.from_normal_bytes(
     cbor.decodeFirstSync(
       "58209fef70dadfafbbfdc5d939ac9a3822efa52cb17eb8f60c1a4878a4ccc02414f6"
     )
   );
 
   console.log(`POLICY_PRIV_KEY: ${policyPrivateKey.to_bech32()}`);
 
   const filePath = '/Users/rahulnair/projects/cardano-mint-nft/log.txt';
   console.log(filePath);
   
   try {
     const rl =  readline.createInterface({
       input: fs.createReadStream(filePath, {encoding: 'utf-8'}),
       crlfDelay: Infinity
     });
 
     rl.on('line', (line) => {
       console.log(`Line from file: ${line}`);
     });
     await events.once(rl, 'close');
   } catch (err) {
     console.error(err);
   }
 
 } catch (err) {
   console.error(`failed to mint nft: ${err.toString()}`);
 } 