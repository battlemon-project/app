import React, { Suspense, useEffect, useState } from 'react';
import { BabylonLoader } from '../components/BabylonLoader';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import { useLemonStore } from '../helpers/lemonStore';
import useLemon from '../hooks/useLemon';
import { useAuth } from '../hooks/useAuth';
import { dummyLemon } from '../helpers/dummyLemon';

const HubScene = dynamic(async () => await import('../scenes/HubScene'), {
  suspense: true,
});

const Hub = () => {
  const { safeMint, successSafeMint, getLemonList } = useLemon();
  const { lemon } = useLemonStore(({ lemon }) => ({ lemon }));
  const [loader, setLoader] = useState(true);
  const { isAuthorized } = useAuth();

  const refreshLemons = async () => {
    setLoader(true)
    const lemons = await getLemonList?.();
    if (lemons && lemons.length > 0) {
      const dummy = dummyLemon();
      const _lemon = {
        id: '1',
        tokenId: '1',
        owner: '',
        image: '',
        type: '',
        url: '',
        properties: dummy.properties,
        items: dummy.items,
      }
      console.log(_lemon)
      useLemonStore.setState({ lemon: _lemon });
    }
    setLoader(false)
  };

  const handleMintLemon = async () => {
    setLoader(true)
    await safeMint?.();
  }

  useEffect(() => {
    if (isAuthorized && !!getLemonList) {
      refreshLemons();
    }
  }, [isAuthorized, !!getLemonList, successSafeMint]);

  if (!isAuthorized) return <BabylonLoader isConnected={false} />;

  return (
    <div className="absolute bottom-16 left-0 pt-56  w-full h-full">
    {!lemon && <div className="text-center">
      {loader && <button className="btn btn-lg btn-dark rounded-3" disabled>
        <span className="spinner-grow spinner-grow-sm mb-1" role="status" aria-hidden="true"></span>
        &nbsp; Loading...
      </button>}
      {!loader && <button className="btn btn-lg btn-dark rounded-3" onClick={handleMintLemon}>
        Mint First NFT
      </button>}
    </div>}
      <div className="w-full h-full flex items-end container mx-auto px-4">
        <Suspense fallback={<BabylonLoader isConnected={true} />}>
          {lemon && <HubScene />}
        </Suspense>
      </div>
    </div>
  );
};

Hub.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;
export default Hub;
