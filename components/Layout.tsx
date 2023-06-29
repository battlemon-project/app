import React from 'react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { lineaTestnet } from 'wagmi/chains';
import { AlertTemplate } from './AlertTemplate';
import { positions, Provider as AlertProvider, transitions } from 'react-alert';
import Head from 'next/head';
import { Header } from './Header/Header';
import { Footer } from './Footer';
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';

interface Props {
  children?: JSX.Element;
}

const options = {
  position: positions.TOP_CENTER,
  timeout: 5000,
  offset: '30px',
  transition: transitions.SCALE,
};

const projectId = '30b84ca08da49c3ef8b9a2145c1306e7';
const { publicClient, chains } = configureChains(
  [lineaTestnet],
  [w3mProvider({ projectId })]
);

const config = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ chains, projectId }),
  publicClient,
});

const ethereumClient = new EthereumClient(config, chains);

export default function Layout({ children }: Props) {
  return (
    <>
      <Head>
        <title>Battlemon GameFi Hub</title>
        <meta
          name="description"
          content="Battlemon - To the last drop of juice"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:site_name" content="Battlemon" />
        <meta property="og:title" content="Battlemon GameFi Hub" />
        <meta property="og:description" content="To the last drop of juice" />
        <meta
          property="og:image"
          content="https://promo.battlemon.com/battlemon.jpg"
        />
        <meta
          property="og:url"
          content="https://promo.battlemon.com/battlemon.jpg"
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@BATTLEM0N" />
        <meta name="twitter:creator" content="@BATTLEM0N" />
        <meta name="twitter:title" content="Battlemon GameFi Hub" />
        <meta name="twitter:description" content="To the last drop of juice" />
        <meta
          name="twitter:image"
          content="https://promo.battlemon.com/battlemon.jpg"
        />
      </Head>
      <AlertProvider template={AlertTemplate} {...options}>
        <WagmiConfig config={config}>
          <div className="flex flex-col min-h-screen">
            <div className="relative z-50">
              <Header network={'eth'} />
            </div>
            <main className="relative flex-grow">{children}</main>
            <div className="relative z-10">
              <Footer />
            </div>
          </div>
        </WagmiConfig>
        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      </AlertProvider>
    </>
  );
}
