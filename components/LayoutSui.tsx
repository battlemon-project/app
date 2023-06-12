import React from 'react';
import { WalletProvider } from '@suiet/wallet-kit';
import { AlertTemplate } from './AlertTemplate';
import { positions, Provider as AlertProvider, transitions } from 'react-alert';
import Head from 'next/head';
import { Header } from './Header/Header';
import { Footer } from './Footer';

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
        <WalletProvider>
          <Header network={'sui'} />
          <main>{children}</main>
          <Footer />
        </WalletProvider>
      </AlertProvider>
    </>
  );
}
