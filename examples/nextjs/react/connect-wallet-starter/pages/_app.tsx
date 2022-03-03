import "../styles/globals.css";
import type { AppProps } from "next/app";

import { ThirdwebProvider } from "@thirdweb-dev/react";

import { ChakraProvider } from "@chakra-ui/react";


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
    <ThirdwebProvider 
      // grab chain ID at https://chainlist.org
      desiredChainId={1}>
        <Component {...pageProps} />
      </ThirdwebProvider>
    </ChakraProvider>
  );
}

export default MyApp;
