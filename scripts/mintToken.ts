import "dotenv/config";
import * as ballotJson from "../artifacts/contracts/Token.sol/MyToken.json";
import { MyToken } from "../typechain";
import { Contract, ethers } from "ethers";
import { ethers as eth } from "hardhat";

async function main() {
  const EXPOSED_KEY =
    "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.PRIVATE_KEY ?? EXPOSED_KEY);

  console.log(`Using address ${wallet.address}`);

  const provider = ethers.providers.getDefaultProvider("ropsten");
  const signer = wallet.connect(provider);

  const accounts = await eth.getSigners();
  // Check if the user pass the address contract parameter
  if (process.argv.length < 3) {
    throw new Error("Please provide token contract address.");
  }
  const tokenAddress = process.argv[2];
  // check if the user pass the index of the proposal
  if (process.argv.length < 4) {
    throw new Error("Please specify the quantity to mint.");
  }

  const mintQuantity = ethers.utils.parseEther(process.argv[3]);

  console.log(`Minting ${mintQuantity} NFTs from address: ${tokenAddress}`);
  try {
    const tokenContract: MyToken = new Contract(
      tokenAddress,
      ballotJson.abi,
      signer
    ) as MyToken;

    const tx = await tokenContract
      .connect(accounts[1])
      .mint(wallet.address, mintQuantity);
    console.log("Awaiting confirmation...");
    await tx.wait();
    console.log(`${mintQuantity} token(s) minted to wallet: ${wallet.address}`);

    const tx2 = await tokenContract.mint(accounts[1].address, mintQuantity);
    console.log("Awaiting confirmation...");
    await tx2.wait();
    console.log(
      `${mintQuantity} token(s) minted to wallet: ${accounts[1].address}`
    );

    const tx3 = await tokenContract.mint(accounts[0].address, mintQuantity);
    console.log("Awaiting confirmation...");
    await tx3.wait();
    console.log(
      `${mintQuantity} token(s) minted to wallet: ${accounts[0].address}`
    );

    const tx4 = await tokenContract.mint(accounts[2].address, mintQuantity);
    console.log("Awaiting confirmation...");
    await tx4.wait();
    console.log(
      `${mintQuantity} token(s) minted to wallet: ${accounts[2].address}`
    );
  } catch (err) {
    console.log(err);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
