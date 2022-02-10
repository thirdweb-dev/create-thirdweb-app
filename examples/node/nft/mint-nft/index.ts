import { ThirdwebSDK } from "@3rdweb/sdk";
import { ethers } from "ethers";


// instantiate the thirdweb sdk
const sdk = new ThirdwebSDK(
  new ethers.Wallet(
    // NEVER share your private key with anyone else!
    process.env.PKEY as string,
    // we are using rinkeby testnet for the example, you can use anything!
    ethers.getDefaultProvider("rinkeby")
  )
);

// instantiate the NFT module (make sure you are on the right chain and have the right contract address)
const nftCollection = sdk.getNFTModule("<NFT_MODULE_ADDRESS>");

// Minting the NFT asynchronously
async function mint() {
  console.log(
    await nftCollection.mint({
      name: "Hi 👋",
      description: "This is my cool NFT!",
      image: "ipfs://QmbGpe6dJQA9awBbTKEULufp9TTjXw1esVUbZNQrLM57nK",
      properties: {},
    })
  );
}

// Running the code! (yes, that's it!)
mint();
