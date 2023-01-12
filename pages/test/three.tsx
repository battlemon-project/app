import Head from 'next/head'
import Loader from '../../components/Loader'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react';
import type {  SuiMoveObject } from "@mysten/sui.js";
import { dummyLemon } from '../../helpers/dummyLemon'

export interface Loader {
  babylon: boolean
  data: boolean
}

const HubScene = dynamic(() => import('../../scenes/HubScene'), {
  suspense: true,
})

export default function Hub() {
  const [ loader, setLoader ] = useState<Loader>({ babylon: true, data: true });
  const [ lemons, setLemons ] = useState<SuiMoveObject[]>([]);

  useEffect(() => {
  }, [loader])

  const refreshLemons = async () => {
    let list: SuiMoveObject [] = [
      dummyLemon(),
      dummyLemon(),
      dummyLemon()
    ];

    setLemons(list);
    setLoader((loader) => ({ ...loader, data: false }));
  }

  useEffect(() => {
    refreshLemons();
  }, [])

  const handleMint = async () => {
    
  }


  return (
    <>
      <Head>
        <title>Battlemon GameFi Hub</title>
        <meta name="description" content="Battlemon - To the last drop of juice" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      { !loader.data && <HubScene lemons={lemons} setLoader={setLoader} handleMint={handleMint} /> }
      { (loader.babylon || loader.data) && <Loader status="connected" />}

    </>
  )
}
