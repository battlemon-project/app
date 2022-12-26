import '../styles/globals.css';
import "bootstrap/dist/css/bootstrap.min.css";
import type { AppProps } from 'next/app';
import { useEffect } from "react";
import { WalletProvider } from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';

export default function App({ Component, pageProps }: AppProps) {

  useEffect(()=>{
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  },[])

  return (
    <WalletProvider>
      <Component {...pageProps} />
    </WalletProvider>
  )
}
