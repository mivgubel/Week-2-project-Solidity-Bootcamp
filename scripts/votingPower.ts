import "dotenv/config";
import * as ballotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import * as TokenJson from "../artifacts/contracts/Token.sol/MyToken.json";
import { CustomBallot, MyToken } from "../typechain";
import { Contract, ethers } from "ethers";
import { ethers as eth } from "hardhat";

// ===================================  !!  ============================================
//This script is really just something I'm using to debug and figure out 
//what functions we need to add to our contract

async function main() {
  const EXPOSED_KEY =
    "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.PRIVATE_KEY ?? EXPOSED_KEY);

  console.log(`Using address ${wallet.address}`);


const provider = ethers.providers.getDefaultProvider("ropsten");
const accounts = await eth.getSigners();
  
const signer = wallet.connect(provider);


  // Check if the user pass the address contract parameter
  if (process.argv.length < 3) {
    throw new Error("Ballot address missing");
  }
  const ballotAddress = process.argv[2];

  if (process.argv.length < 4) {
    throw new Error("Token address missing");
  }
  //ARG2 token address
  const tokenAddress = process.argv[3];

  try {
    const ballotContract: CustomBallot = new Contract(
      ballotAddress,
      ballotJson.abi,
      signer
    ) as CustomBallot;

    const tokenContract: MyToken = new Contract(
        tokenAddress,
        TokenJson.abi,
        signer
    ) as MyToken;
    // const tx = await ballotContract.connect(accounts[1]).vote(indexProposal);

    var options = { gasPrice: 1000000000, gasLimit: 8500000 };
    // const mintRoleTxn = await tokenContract.grantMintRole(wallet.address, options);
    // console.log(`Mint granted to ${wallet.address}`);

    const pastVotesTxn = await ballotContract.returnPastVotes(options);
    console.log(`Past votes: ${pastVotesTxn}`);


    // const checkTxn1 = await ballotContract.votingPower();
    // console.log(`voting power for your address: ${checkTxn1}`);

    // const mintTxn = tokenContract.mint(wallet.address, 5);
    // console.log(`Minting 5 Tokens to ${wallet.address}`);

    // const checkTxn2 = await ballotContract.votingPower();
    // console.log(`New voting power after minting: ${checkTxn2}`);
  } catch (err) {
    console.log(err);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
