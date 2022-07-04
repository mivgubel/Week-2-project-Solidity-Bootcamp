import { ethers } from "ethers";
import "dotenv/config";
import * as TokenJson from "../artifacts/contracts/Token.sol/MyToken.json";

const EXPOSED_KEY =
  "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Data = [];
  for (let i = 0; i < array.length; i++) {
    bytes32Data.push(ethers.utils.formatBytes32String(array[i]));
  }
  return bytes32Data;
}

export async function main() {
  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.PRIVATE_KEY ?? EXPOSED_KEY);

  console.log(`Using address ${wallet.address}`);

  const provider = ethers.getDefaultProvider("ropsten");
  const signer = wallet.connect(provider);

  console.log("Deploying Token Contract");

  const TokenContractFactory = new ethers.ContractFactory(
    TokenJson.abi,
    TokenJson.bytecode,
    signer
  );

  const TokenContract = await TokenContractFactory.deploy();

  console.log("Awaiting Confirmation...");
  await TokenContract.deployed();
  console.log(`Contract successfully deployed at ${TokenContract.address}`);
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
