import React, { useEffect } from 'react';
import Layout from '../../components/Layout';
import { BabylonLoader } from '../../components/BabylonLoader';
import ChestScene from '../../scenes/ChestScene';
import usePickAxe from '../../hooks/usePickAxe';
import classNames from 'classnames';

const MarketPlace = () => {
  const { authorized, mintPickAxe, successMintPickAxe } = usePickAxe();

  useEffect(() => {
    document?.body.classList.add('babylon-page');

    return function cleanup() {
      document?.body.classList.remove('babylon-page');
    };
  }, []);

  if (!authorized) return <BabylonLoader isConnected={false} />;

  return (
    <>
      <div className={classNames('absolute w-full flex bottom-4')}>
        <div className="text-white text-center text-3xl font-semibold basis-1/3 pl-24">
          <div>0 / 2000</div>
          <button className="px-6 py-2 mt-3 bg-white rounded-lg text-xl font-normal text-black hover:bg-opacity-70 transition-all">
            0.2ETH
          </button>
        </div>
        <div className="text-white text-center text-3xl font-semibold basis-1/3">
          <div>0 / 1000</div>
          <button className="px-6 py-2 mt-3 bg-white rounded-lg text-xl font-normal text-black hover:bg-opacity-70 transition-all">
            0.5ETH
          </button>
        </div>
        <div className="text-white text-center text-3xl font-semibold basis-1/3 pr-20">
          <div>0 / 500</div>
          <button className="px-6 py-2 mt-3 bg-white rounded-lg text-xl font-normal text-black hover:bg-opacity-70 transition-all">
            1ETH
          </button>
        </div>
      </div>
      <ChestScene />
    </>
  );
};

MarketPlace.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;
export default MarketPlace;
