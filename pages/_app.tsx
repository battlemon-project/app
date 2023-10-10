import type { ReactElement, ReactNode } from 'react';
import React from 'react';
import '../styles/globals.css';
import '@suiet/wallet-kit/style.css';
import type { AppProps } from 'next/app';
import type { NextPage } from 'next';
import Script from 'next/script';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return <>
    {getLayout(<Component {...pageProps} />)}
    <Script src="https://www.googletagmanager.com/gtag/js?id=G-FXNCZP5QS7" strategy="afterInteractive" />
    <Script id="google-analytics" strategy="afterInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-FXNCZP5QS7');
      `}
    </Script>
  </>
  ;
}
