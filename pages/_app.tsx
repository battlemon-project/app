import '../styles/globals.css';
import "bootstrap/dist/css/bootstrap.min.css";
import type { AppProps } from 'next/app';
import { EthosConnectProvider } from 'ethos-connect';
import { useEffect } from "react";



export default function App({ Component, pageProps }: AppProps) {
  return (
    <EthosConnectProvider>
      <Component {...pageProps} />
    </EthosConnectProvider>
  )
}
