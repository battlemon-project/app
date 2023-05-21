import React, { Suspense, useEffect } from 'react';
import Layout from '../../components/Layout';
import BabylonLoader from '../../components/BabylonLoader';
import dynamic from 'next/dynamic';

const HomeScene = dynamic(async () => await import('../../scenes/ChestScene'), {
  suspense: true,
});

const Stickers = () => {
  useEffect(() => {
    document?.body.classList.add('babylon-page');

    return function cleanup() {
      document?.body.classList.remove('babylon-page');
    };
  }, []);

  return (
    <div className="container pt-5 mt-5">
      <Suspense fallback={<BabylonLoader isConnected={true} />}>
        <HomeScene />
      </Suspense>
    </div>
  );
};

Stickers.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;
export default Stickers;
