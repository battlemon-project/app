import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useEffect } from 'react';
import { useRouter } from "next/router";
import { useWallet, useSuiProvider } from '@suiet/wallet-kit';

function arrayBufferToBase64( buffer: Uint8Array ) {
  var binary = '';
  var bytes = new Uint8Array( buffer );
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode( bytes[ i ] );
  }
  return window.btoa( binary );
}

export default function Home() {
  const { query } = useRouter();
  const wallet = useWallet();

  useEffect(() => {        
    if (wallet && wallet.address) {
      const clientMessage = query.client_id ? `${query.client_id}` : '';
      (async function () {
        const sign = await wallet.signMessage({
          message: new TextEncoder().encode(clientMessage)
        })
        if (!sign) return;
        const data = {
          signedMessage: arrayBufferToBase64(sign.signedMessage),
          signature: arrayBufferToBase64(sign.signature),
          publicKey: arrayBufferToBase64(wallet.account?.publicKey as Uint8Array),
          sui_wallet_address: wallet.address,
          client_id: clientMessage
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
