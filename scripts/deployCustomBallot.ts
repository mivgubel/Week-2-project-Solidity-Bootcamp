import { ethers } from "ethers";
import "dotenv/config";
import * as CustomBallotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";

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
  // wallet creation
  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.PRIVATE_KEY ?? EXPOSED_KEY);

  console.log(`Using address ${wallet.address}`);

  // get provider and signer
  const provider = ethers.getDefaultProvider("ropsten");
  const signer = wallet.connect(provider);

  console.log("Deploying Ballot contract");
  console.log("Proposals: ");

  // we validate that the user give us the Token Address as the third argument
  if (process.argv.length < 3) throw new Error("Token Address Missing");
  const tokenAddress = process.argv[2]; // get the address from the command line args

  // checking if the user add proposals
  if (process.argv.length < 4) throw new Error("Proposals Missing");
  const proposals = process.argv.slice(3);
  proposals.forEach((element, index) => {
    console.log(`Proposal Num ${index + 1}: ${element}`);
  });

  // Creation of Contract Factory and Contract Deployment
  const CustomBallotFactory = new ethers.ContractFactory(
    CustomBallotJson.abi,
    CustomBallotJson.bytecode,
    signer
  );
  const CustomBallotContract = await CustomBallotFactory.deploy(
    convertStringArrayToBytes32(proposals),
    tokenAddress
  );

  console.log("Awaiting confirmations");
  await CustomBallotContract.deployed();
  console.log("Completed");
  console.log(`Contract deployed at ${CustomBallotContract.address}`);
  console.log(`Tx Hash: ${CustomBallotContract.deployTransaction.hash}`);
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
