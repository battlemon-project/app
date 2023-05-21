import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import BabylonLoader, {
  type BabylonLoaderType,
} from '../../components/BabylonLoader';
import dynamic from 'next/dynamic';
import { type LemonType } from '../../helpers/lemonStore';

const HubScene = dynamic(async () => await import('../../scenes/HubScene'), {
  suspense: true,
});

export default function Hub() {
  const [loader, setLoader] = useState<BabylonLoaderType>({
    babylon: true,
    data: true,
  });
  const [, setLemons] = useState<LemonType[]>([]);

  useEffect(() => {}, [loader]);

  const refreshLemons = async () => {
    const list: LemonType[] = [];

    setLemons(list);
    setLoader((loader) => ({ ...loader, data: false }));
  };

  useEffect(() => {
    refreshLemons();
  }, []);

  const handleMintLemon = async () => {};

  return (
    <>
      <Head>
        <title>Battlemon GameFi Hub</title>
        <meta
          name="description"
          content="Battlemon - To the last drop of juice"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!loader.data && (
        <HubScene setLoader={setLoader} handleMintLemon={handleMintLemon} />
      )}
      {(loader.babylon || loader.data) && <BabylonLoader isConnected={true} />}
    </>
  );
}
