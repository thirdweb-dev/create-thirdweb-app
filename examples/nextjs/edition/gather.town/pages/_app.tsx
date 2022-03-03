import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@3rdweb/react";
import { ChakraProvider } from "@chakra-ui/react";

// add or remove chainIDs you want to allow signers to be on.
// grad the chain ID from https://chainlist.org/
const supportedChainIds = [1];

/**
 * Include the connectors you want to support
 * injected - MetaMask
 * magic - Magic Link
 * walletconnect - Wallet Connect
 * walletlink - Coinbase Wallet
 */

const connectors = {
  injected: {},
  magic: {
    apiKey: process.env.NEXT_PUBLIC_MAGIC_API_KEY as string, // Your magic api key
    chainId: 1, // The chain ID you want to allow on magic
  },
  walletconnect: {},
  walletlink: {
    appName: "thirdweb - demo",
    url: "https://thirdweb.com",
    darkMode: false,
  },
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <ThirdwebProvider
        supportedChainIds={supportedChainIds}
        connectors={connectors}
      >
        <Component {...pageProps} />
      </ThirdwebProvider>
    </ChakraProvider>
  );
}

export default MyApp;
