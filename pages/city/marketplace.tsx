import React, { Suspense, useEffect } from 'react';
import Layout from '../../components/Layout';
import BabylonLoader from '../../components/BabylonLoader';
import HomeScene from '../../scenes/ChestScene';

const MarketPlace = () => {
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

MarketPlace.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;
export default MarketPlace;
