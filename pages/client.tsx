import { ReactElement, useEffect } from 'react';
import { useRouter } from "next/router";
import { useWallet } from "@suiet/wallet-kit";
import LayoutSui from '../components/LayoutSui';

// function arrayBufferToBase64( buffer: Uint8Array ) {
//   var binary = '';
//   var bytes = new Uint8Array( buffer );
//   var len = bytes.byteLength;
//   for (var i = 0; i < len; i++) {
//     binary += String.fromCharCode( bytes[ i ] );
//   }
//   return window.btoa( binary );
// }

const Game = () => {
  const { query } = useRouter();
  const wallet = useWallet();

  useEffect(() => {        
    if (wallet && wallet?.account?.address) {
      const clientMessage = query.client_id ? `${query.client_id}` : '';
      (async function () {
        const sign = await wallet.signMessage({
          message: new TextEncoder().encode(clientMessage)
        })
        if (!sign) return;
        const data = {
          signedMessage: sign.messageBytes,
          signature: sign.signature,
          publicKey: wallet.account?.publicKey, //arrayBufferToBase64(wallet.account?.publicKey as Uint8Array),
          sui_wallet_address: wallet?.account?.address,
          client_id: clientMessage
        }
        const result = await fetch('/api/game', {
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const answer = await result.json();
      })();
    }
  }, [wallet?.account?.address]);

  useEffect(() => {        
    document.documentElement.classList.add("mountings");
    return () => {
      document.documentElement.classList.remove("mountings")
    }
  }, []);

  return (
    <>
      <h2 className="text-center p-5 mt-5 pb-0">Connect Battlemon Game</h2>
      <h4 className="text-center p-3">Yuo need to install <a style={{color: '#fff'}} href="https://chrome.google.com/webstore/detail/suiet-sui-wallet/khpkpbbcccdmmclmpigdgddabeilkdpd">Suiet Wallet</a></h4>
    </>
  )
}


Game.getLayout = (page: ReactElement) => <LayoutSui>{page}</LayoutSui>
export default Game