import "../styles/globals.css";
import type { AppProps } from "next/app";

import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";

import { ChakraProvider } from "@chakra-ui/react";


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
    <ThirdwebProvider desiredChainId={ChainId.Mainnet}>
        <Component {...pageProps} />
      </ThirdwebProvider>
    </ChakraProvider>
  );
}

export default MyApp;
