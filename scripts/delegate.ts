import { ethers, Contract } from "ethers";
import "dotenv/config";
import { CustomBallot, MyToken } from "../typechain";
import * as TokenJson from "../artifacts/contracts/Token.sol/MyToken.json";
// import * as CustomBallotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import { ethers as eth } from "hardhat";

const EXPOSED_KEY =
  "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

async function main() {
  // Connect wallets:
  console.log("== Start delegating == ");
  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.PRIVATE_KEY ?? EXPOSED_KEY);
  console.log(`Using address 1: ${wallet.address}`);

  const provider = ethers.providers.getDefaultProvider("ropsten");

  const accounts = await eth.getSigners();
  console.log(`Using address 1: ${accounts[0].address}`);
  console.log(`Using address 2: ${accounts[1].address}`);

  // Get signers & voters:
  const signer = wallet.connect(provider);
  const voters = [wallet, accounts[0], accounts[1]];

  // Get Contracts - TokenContract + BallotContract:
  console.log("== Deploy Contracts ==");
  const TokenContract: MyToken = new Contract(
    "0x45fa02999Fb4f5E7C6e64cC1064D61A9fcBF5F14",
    TokenJson.abi,
    signer
  ) as MyToken;
  /*
  const BallotContract: CustomBallot = new Contract(
    "0xeFdBAac2e197331CF8dBc6eb057EC6e62f8019AC",
    CustomBallotJson.abi,
    signer
  ) as CustomBallot;
*/
  // Get voting poower:

  // Start Delegating:
  console.log("== Delegating ==");

  const delegateTransaction3 = await TokenContract.delegate(wallet.address);
  const receipt3 = await delegateTransaction3.wait();
  console.log(
    `Self Delegation 2: for ${wallet.address} on trasanction: ${receipt3.transactionHash}`
  );

  const delegateTransaction = await TokenContract.connect(accounts[0]).delegate(
    accounts[0].address
  );
  const receipt = await delegateTransaction.wait();
  console.log(
    `Self Delegation 2: for ${accounts[0].address} on trasanction: ${receipt.transactionHash}`
  );

  const delegateTransaction2 = await TokenContract.connect(
    accounts[1]
  ).delegate(accounts[1].address);
  const receipt2 = await delegateTransaction2.wait();
  console.log(
    `Self Delegation 2: for ${accounts[1].address} on trasanction: ${receipt2.transactionHash}`
  );

  // Voting status:
  console.log("== Voting: ==");
  for (const voter of voters) {
    const votingPower = await TokenContract.getVotes(voter.address);
    console.log(
      `Voting power of ${voter.address} is ${Number(
        ethers.utils.formatEther(votingPower)
      )}`
    );
  }

  process.exitCode = 0;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
