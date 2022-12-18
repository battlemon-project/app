import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import dynamic from 'next/dynamic'
import { Suspense, useEffect, useState } from 'react';
import { ethos } from 'ethos-connect';
import type { JsonRpcProvider, SuiObject, SuiMoveObject } from "@mysten/sui.js";

export interface Loader {
  babylon: boolean
  data: boolean
}

const HubScene = dynamic(() => import('../scenes/HubScene'), {
  suspense: true,
})

export default function Hub() {
  const [ loader, setLoader ] = useState<Loader>({ babylon: true, data: true });
  const [ lemons, setLemons ] = useState<SuiMoveObject[]>([]);
  const { provider }: { provider: JsonRpcProvider} = ethos.useProviderAndSigner()
  const { wallet, status } = ethos.useWallet();

  useEffect(() => {
    console.log(loader)
  }, [loader])

  const refreshLemons = async () => {
    if (!wallet?.address) return;
    let list: SuiMoveObject [] = [];



    const objects = await provider.getObjectsOwnedByAddress(wallet.address)
    for (const object of objects.filter(object => object.type.includes('lemon'))) {
      let fullObject = await provider.getObject(object.objectId);
      let { data } = fullObject.details as SuiObject
      list.push(data as SuiMoveObject)
    }
    list = list.sort((a,b) => (b.fields.created || 0) - a.fields.created);
    setLemons(list);
    setLoader((loader) => ({ ...loader, data: false }));
  }

  useEffect(() => {
    if (status == 'no_connection') {
      setLoader((loader) => ({ ...loader, data: true }));
    }
    if (status) {
      refreshLemons();
    } 
  }, [status, wallet?.address])

  const handleMint = async () => {
    if (!wallet) return;
    const signableTransaction = {
      kind: 'moveCall' as const,
      data: {
        packageObjectId: '0xd0b290b77ab543171422cffd7968d0ad749f29bf',
        module: 'lemon',
        function: 'create_lemon',
        typeArguments: [],
        arguments: [
          '0x36e92c0c400e40fc7621dbf883722a522ed093e7',
        ],
        gasBudget: 10000,
      },
    }

    setLoader((loader) => ({ ...loader, data: true }));
    try {
      await wallet.signAndExecuteTransaction(signableTransaction);
    } catch (e) {
      setLoader((loader) => ({ ...loader, data: false }));
    }
    await refreshLemons();
  }


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
      
      { wallet?.address && 
        <div className="sticky-top text-center d-inline-block position-absolute" style={{ zIndex: 1080, left: '50%', top: '15px', transform: 'translateX(-50%)' }}>
          <button className="btn btn-lg btn-light px-4" onClick={handleMint}>Mint NFT (Devnet)</button> 
        </div>
      }

      { !loader.data && <HubScene lemons={lemons} setLoader={setLoader} /> }
      {JSON.stringify(loader)}
      { (loader.babylon || loader.data) && <Loader status={status} />}

      <Footer />
    </>
  )
}
