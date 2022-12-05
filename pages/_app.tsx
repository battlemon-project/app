import '../styles/globals.css';
import "bootstrap/dist/css/bootstrap.min.css";
import type { AppProps } from 'next/app';
import { EthosConnectProvider } from 'ethos-connect';
import { useEffect } from "react";
import { RecoilRoot } from 'recoil';



export default function App({ Component, pageProps }: AppProps) {

  useEffect(()=>{
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  },[])

  return (
    <EthosConnectProvider>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </EthosConnectProvider>
  )
}
