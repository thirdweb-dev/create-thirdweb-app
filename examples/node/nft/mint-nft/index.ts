import { ThirdwebSDK } from "@3rdweb/sdk";
import { ethers } from "ethers";

const sdk = new ThirdwebSDK(
  new ethers.Wallet(
    // never share your
    process.env.PKEY as string,
    // we are using rinkeby testnet for the example, you can use anything!
    ethers.getDefaultProvider("rinkeby")
  )
);

const nftCollection = sdk.getNFTModule("<MODULE_ADDRESS>");

// assign the smart contract address
const nft_smart_contract_address = "<NFT_CONTRACT_ADDRESS>";

// Instantiate NFT Collection module
const nft = sdk.getNFTModule(nft_smart_contract_address);

// Minting the NFT asynchronously
async function mint() {
  console.log(
    await nft.mint({
      name: "Hi 👋",
      description: "This is my cool NFT!",
      image: "ipfs://QmbGpe6dJQA9awBbTKEULufp9TTjXw1esVUbZNQrLM57nK",
      properties: {},
    })
  );
}

// Running the code! (yes, that's it!)
mint();
