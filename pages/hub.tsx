import React, { useEffect, useState } from 'react';
import {
  BabylonLoader,
  type BabylonLoaderType,
} from '../components/BabylonLoader';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import { useLemonStore } from '../helpers/lemonStore';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import alchemy, { getLemons, mintLemonData } from '../helpers/alchemy';
import { useAlert } from 'react-alert';

const HubScene = dynamic(async () => await import('../scenes/HubScene'), {
  suspense: true,
});

const Hub = () => {
  const [loader, setLoader] = useState<BabylonLoaderType>({
    babylon: true,
    data: true,
  });
  const alert = useAlert();
  const { address, isConnected } = useAccount();
  const [hasMounted, setHasMounted] = useState(false);

  const { config } = usePrepareContractWrite(mintLemonData(address));
  const { write } = useContractWrite(config);

  useEffect(() => {
    // console.log(loader)
  }, [loader]);

  const refreshLemons = async () => {
    if (process.env.NEXT_PUBLIC_PRODUCTION == 'true') {
      setLoader((loader) => ({ ...loader, data: false }));
      return;
    }
    if (!address) return;
    const lemonOwnedNfts = await getLemons(address);
    useLemonStore.setState({
      lemons: lemonOwnedNfts,
      activePlatform: 1,
      inventoryIsOpened: false,
    });
    setLoader((loader) => ({ ...loader, data: false }));
  };

  useEffect(() => {
    if (!isConnected) {
      setLoader((loader) => ({ ...loader, data: true }));
    } else {
      refreshLemons();
      alchemy.ws.on(
        {
          address: '0xeae26aa7aD3E54C208a22a78bd9E5d2D7ccFC18D',
          topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          ],
        },
        (tx) => {
          setLoader((loader) => ({ ...loader, data: true }));
          refreshLemons();
        }
      );
    }
  }, [isConnected]);

  const handleMintLemon = async () => {
    if (process.env.NEXT_PUBLIC_PRODUCTION == 'true') {
      return;
    }
    setLoader((loader) => ({ ...loader, data: true }));
    try {
      await write?.();
    } catch (e) {
      const { message } = e as Error;
      alert.show(message, { type: 'error' });
      setLoader((loader) => ({ ...loader, data: false }));
    }
  };

  useEffect(() => {
    setHasMounted(true);
    document.body.classList.add('babylon-page');
    return function cleanup() {
      document.body.classList.remove('babylon-page');
    };
  }, []);

  return (
    <div className="absolute top-0 left-0  w-full h-full">
      <div className="w-full h-full container mx-auto px-4">
        {process.env.NEXT_PUBLIC_PRODUCTION != 'true' &&
          hasMounted &&
          address && (
            <div className="flex justify-center">
              <button
                className="bg-white py-2 px-6 rounded-xl text-xl hover:bg-gray transition-all"
                onClick={handleMintLemon}
              >
                Mint NFT (Testnet)
              </button>
            </div>
          )}

        {!loader.data && (
          <HubScene setLoader={setLoader} handleMintLemon={handleMintLemon} />
        )}
        {(loader.babylon || loader.data) && (
          <BabylonLoader isConnected={isConnected && hasMounted} />
        )}
      </div>
    </div>
  );
};

Hub.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;
export default Hub;
