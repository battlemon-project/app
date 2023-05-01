import { useEffect } from "react";

import { WagmiConfig, createClient, configureChains } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
 

const { chains, provider } = configureChains(
  [ sepolia, mainnet ], 
  [ publicProvider(), publicProvider() ]
)

const client = createClient({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  provider,
})

import AlertTemplate from './AlertTemplate'
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import Head from 'next/head'
import Header from './Header'
import Footer from './Footer'

type Props = {
  children?: JSX.Element;
};

const options = {
  // you can also just use 'bottom center'
  position: positions.TOP_CENTER,
  timeout: 5000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE
}

export default function Layout({ children }: Props) {

  useEffect(()=>{
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  },[])

  return (
    <>
      <Head>
        <title>Battlemon GameFi Hub</title>
        <meta name="description" content="Battlemon - To the last drop of juice" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:site_name" content="Battlemon"/>
        <meta property="og:title" content="Battlemon GameFi Hub"/>
        <meta property="og:description" content="To the last drop of juice"/>
        <meta property="og:image" content="https://promo.battlemon.com/battlemon.jpg"/>
        <meta property="og:url" content="https://promo.battlemon.com/battlemon.jpg"/>
        <meta property="og:type" content="website"/>
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:site" content="@BATTLEM0N"/>
        <meta name="twitter:creator" content="@BATTLEM0N"/>
        <meta name="twitter:title" content="Battlemon GameFi Hub"/>
        <meta name="twitter:description" content="To the last drop of juice"/>
        <meta name="twitter:image" content="https://promo.battlemon.com/battlemon.jpg"/>
      </Head>
      <AlertProvider template={AlertTemplate} {...options}>
        <WagmiConfig client={client}>
          <Header network={'eth'} />
            <main>{children}</main>
          <Footer />
        </WagmiConfig>
      </AlertProvider>
    </>
  )
}