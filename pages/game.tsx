import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useEffect } from 'react';
import { useRouter } from "next/router";
import { useWallet, useSuiProvider } from '@suiet/wallet-kit';

export default function Home() {
  const { query } = useRouter();
  const wallet = useWallet();

  useEffect(() => {        
    if (wallet && wallet.address) {
      (async function () {
        const sign = await wallet.signMessage({
          message: new TextEncoder().encode(query.client_id as string || '')
        })
        if (!sign) return;
        const data = {
          signedMessage: sign.signedMessage,
          signature: sign.signature,
          publicKey: wallet.account?.publicKey as Uint8Array,
          address: wallet.address,
          client_id: query.client_id
        }
        const result = await fetch('/api/game', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const answer = await result.json();
        console.log(answer)
      })();
    }
  }, [wallet?.address]);

  useEffect(() => {        
    document.documentElement.classList.add("mountings");
    return () => {
      document.documentElement.classList.remove("mountings")
    }
  }, []);

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

      <Header />

      <h2 className="text-center p-5 mt-5">Connect Battlemon Game with Sui</h2>
      
      <Footer />
    </>
  )
}
