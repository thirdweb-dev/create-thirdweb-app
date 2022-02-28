import { ethers } from "ethers";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import fetch from "node-fetch";
export default async function handler(req, res) {
  const address = ethers.utils.verifyMessage(
    "I would like to get access to the gather event!",
    req.query.signature
  );
  const email = req.query.email;
  console.log(address, email);
  const alchemy = process.env.ALCHEMY_RPC;
  // we are using polygon mumbai testnet, but you can use any other RPC
  const sdk = new ThirdwebSDK(
    alchemy
      ? alchemy
      : ethers.getDefaultProvider("https://matic-mumbai.chainstacklabs.com")
  );
  const module = sdk.getEdition(process.env.EDITION_ADDRESS);
  const tokenId = process.env.TOKEN_ID;
  const balance = await module.balanceOf(address, tokenId);
  const payload = {
    apiKey: process.env.GATHER_API_KEY,
    spaceId: process.env.GATHER_SPACE_ID.replace("/", `\\`),
    guestlist: {
      [`${email}`]: {
        name: req.query.name,
        role: "guest",
        affiliation: "Token Holder",
      },
    },
  };
  console.log(payload);
  if (balance.gt(0)) {
    await fetch("https://gather.town/api/setEmailGuestlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          console.log(res.status);
          console.log(res.statusText);
        }
      })
      .then((data) => {
        if (Object.keys(data).includes(email)) {
          res.send({
            success: true,
            message: "Email added to guestlist",
          });
        } else {
          res.send({
            success: false,
            message: "Some error occured",
          });
        }
      });
  } else {
    res.send({
      success: false,
      message: "You don't have enough tokens",
    });
  }
}
