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
    console.log(objects)
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
        packageObjectId: '0xdbbac2296c05c84d537c29be0085818a1badd0f4',
        module: 'lemon',
        function: 'create_lemon',
        typeArguments: [],
        arguments: [
          '0x28ba6a8b750a973cf55a3438a1e5d906887f2e34',
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
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      
      { wallet?.address && 
        <div className="sticky-top text-center d-inline-block position-absolute" style={{ zIndex: 980, left: '50%', top: '90px', transform: 'translateX(-50%)' }}>
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
