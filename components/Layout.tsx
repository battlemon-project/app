import React, { useEffect, useState } from 'react';
import {
  configureChains,
  createConfig,
  useSwitchNetwork,
  WagmiConfig,
} from 'wagmi';
import { AlertTemplate } from './AlertTemplate';
import { positions, Provider as AlertProvider, transitions } from 'react-alert';
import Head from 'next/head';
import { Header } from './Header/Header';
import { Footer } from './Footer';
import { useNetwork } from 'wagmi';
import Script from 'next/script';
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { Toaster } from 'react-hot-toast';
import {
  AuthProvider,
  type UserType,
} from '../context/AuthContext/AuthContext';
import { useCookies } from 'react-cookie';
import { useAuth } from '../hooks/useAuth';
import { lineaMainnet, lineaNetwork } from '../helpers/linea';
import { lineaTestnet } from 'wagmi/chains';
import {useRouter} from "next/router";

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
  [lineaMainnet, lineaTestnet],
  [w3mProvider({ projectId }), w3mProvider({ projectId })]
);
console.log();
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
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-FXNCZP5QS7" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
  
            gtag('config', 'G-FXNCZP5QS7');
          `}
        </Script>
      </Head>
      <AlertProvider template={AlertTemplate} {...options}>
        <WagmiConfig config={config}>
          <AuthBlock>{children}</AuthBlock>
        </WagmiConfig>
        <Toaster />
        <Web3Modal
          mobileWallets={[
            {
              id: '5978418d55211a6fe3f600df88afcc05a94f046998452dd1ca21d86fc7157c17',
              name: 'UTORG',
              links: {
                universal: 'https://link.utorg.com/zp0f',
                native: 'https://link.utorg.com/zp0f',
              },
            },
          ]}
          desktopWallets={[
            {
              id: '5978418d55211a6fe3f600df88afcc05a94f046998452dd1ca21d86fc7157c17',
              name: 'UTORG',
              links: {
                universal: 'https://utorg.app/',
                native: 'https://utorg.app/',
              },
            },
          ]}
          walletImages={{
            '5978418d55211a6fe3f600df88afcc05a94f046998452dd1ca21d86fc7157c17':
              'https://static.utorg.com/icons/app.png',
          }}
          projectId={projectId}
          ethereumClient={ethereumClient}
        />
      </AlertProvider>
    </>
  );
}

const AuthBlock = ({ children }: Props) => {
  const [hasMounted, setHasMounted] = useState(false);
  const { chain } = useNetwork();
  const [user, setUser] = useState<UserType | null>(null);
  const [cookies] = useCookies();
  const { fetchUserProfile } = useAuth();
  const router = useRouter();
  const { switchNetwork } = useSwitchNetwork();

  const changeNetwork = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    switchNetwork?.(lineaNetwork.id);
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const token = cookies.auth_token;
    if (token && Boolean(fetchUserProfile)) {
      fetchUserProfile(token).then((d) => {
        setUser(d);
      });
    }
  }, []);

  useEffect(() => {
    const token = cookies.auth_token;
    if (token && Boolean(fetchUserProfile)) {
      fetchUserProfile(token).then((d) => {
        setUser(d);
      });
    }
  }, [cookies.auth_token]);

  if (!hasMounted) return <></>;

  if (
    (process.env.NEXT_PUBLIC_PRODUCTION !== 'true' && chain?.id != 59140) ||
    (process.env.NEXT_PUBLIC_PRODUCTION == 'true' && chain?.id != 59144)
    && router.asPath !== '/'
  ) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="relative z-50">
          <Header network="eth" />
        </div>
        <main className="flex-grow flex">
          <div className="m-auto text-center">
            <h3 className="text-white text-xl">
              Please Sign in and change Network to Linea{' '}
              {process.env.NEXT_PUBLIC_PRODUCTION == 'true'
                ? 'Mainnet'
                : 'Testnet'}
            </h3>
            <a
              className="text-white text-xl underline"
              href="#"
              onClick={changeNetwork}
            >
              Change right now
            </a>
          </div>
        </main>
        <div className="relative z-10">
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <AuthProvider value={{ user, setUser }}>
      <div className="flex flex-col min-h-screen">
        <div className="relative z-50">
          <Header network="eth" />
        </div>
        <main className="flex-grow">{children}</main>
        <div className="relative z-10">
          <Footer />
        </div>
      </div>
    </AuthProvider>
  );
};
