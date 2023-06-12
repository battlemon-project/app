import React from 'react';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { lineaTestnet, mainnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { AlertTemplate } from './AlertTemplate';
import { positions, Provider as AlertProvider, transitions } from 'react-alert';
import Head from 'next/head';
import { Header } from './Header/Header';
import { Footer } from './Footer';

const { chains, provider } = configureChains(
  [lineaTestnet, mainnet],
  [publicProvider(), publicProvider()]
);

const client = createClient({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  provider,
});

interface Props {
  children?: JSX.Element;
}

const options = {
  position: positions.TOP_CENTER,
  timeout: 5000,
  offset: '30px',
  transition: transitions.SCALE,
};

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
        <WagmiConfig client={client}>
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
      </AlertProvider>
    </>
  );
}
