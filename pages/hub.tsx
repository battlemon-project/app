import React, { Suspense, useEffect, useState } from 'react';
import { BabylonLoader } from '../components/BabylonLoader';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import { useLemonStore } from '../helpers/lemonStore';
import useLemon from '../hooks/useLemon';
import { useAuth } from '../hooks/useAuth';

const HubScene = dynamic(async () => await import('../scenes/HubScene'), {
  suspense: true,
});

const Hub = () => {
  const { safeMint, successSafeMint, getLemonList } = useLemon();
  const [loader, setLoader] = useState(true);
  const { address, isAuthorized } = useAuth();


  const refreshLemons = async () => {
    if (process.env.NEXT_PUBLIC_PRODUCTION == 'true') {
      setLoader(false);
      return;
    }
    if (!address) return;
    const lemons = await getLemonList?.();
    useLemonStore.setState({
      lemon: lemons?.[0],
      inventoryIsOpened: false,
    });
    setLoader(false);
  };

  const handleMintLemon = async () => {
    await safeMint?.();
  }

  useEffect(() => {
    if (isAuthorized && !!getLemonList) {
      refreshLemons();
    }
  }, [isAuthorized, !!getLemonList]);

  useEffect(() => {
    document.body.classList.add('babylon-page');
    return function cleanup() {
      document.body.classList.remove('babylon-page');
    };
  }, []);

  if (!isAuthorized) return <BabylonLoader isConnected={false} />;

  return (
    <div className="absolute bottom-16 left-0 pt-56  w-full h-full">
      <div className="w-full h-full flex items-end container mx-auto px-4">

        <Suspense fallback={<BabylonLoader isConnected={true} />}>
          <HubScene handleMintLemon={handleMintLemon} />
        </Suspense>
      </div>
    </div>
  );
};

Hub.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;
export default Hub;
