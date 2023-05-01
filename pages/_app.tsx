import type { ReactElement, ReactNode } from 'react';
import '../styles/globals.css';
import '@suiet/wallet-kit/style.css';
import "bootstrap/dist/css/bootstrap.min.css";
import type { AppProps } from 'next/app';
import type { NextPage } from 'next';

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(
    <Component {...pageProps} />
  );
}
