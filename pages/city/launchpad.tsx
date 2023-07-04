import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { BabylonLoader } from '../../components/BabylonLoader';
import ChestScene from '../../scenes/ChestScene';
import usePickAxe from '../../hooks/usePickAxe';
import classNames from 'classnames';
import { useAuth } from '../../hooks/useAuth';
import { useChests } from '../../hooks/useChests';

const Launchpad = () => {
  const { openA, openB, openC, openAStart, openBStart, openCStart } =
    useChests();
  const [chestType, setChestType] = useState<string>();
  const { mintPickAxe, successMintPickAxe } = usePickAxe();
  const { isAuthorized } = useAuth();

  const handleOpenA = async () => {
    setChestType('A');
    openAStart?.();
    await mintPickAxe?.();
  };

  const handleOpenB = async () => {
    setChestType('B');
    openBStart?.();
    await mintPickAxe?.();
  };

  const handleOpenC = async () => {
    setChestType('C');
    openCStart?.();
    await mintPickAxe?.();
  };

  useEffect(() => {
    if (chestType == 'A') {
      openA?.();
    }
    if (chestType == 'B') {
      openB?.();
    }
    if (chestType == 'C') {
      openC?.();
    }
  }, [successMintPickAxe]);

  useEffect(() => {
    document?.body.classList.add('babylon-page');

    return function cleanup() {
      document?.body.classList.remove('babylon-page');
    };
  }, []);

  if (!isAuthorized) return <BabylonLoader isConnected={false} />;

  return (
    <>
      <ChestScene />
      <div
        className={classNames(
          `absolute w-full flex pt-4 justify-center ${chestType ? 'bottom-3' : 'top-1/2'}`
        )}
      >
        {(!chestType || chestType == 'A') && (
          <div className="text-white text-center text-3xl font-semibold basis-1/3 p-10">
            <div>0 / &#8734;</div>
            <button
              className="px-6 py-2 mt-3 bg-white rounded-lg text-xl font-normal text-black hover:bg-opacity-70 transition-all"
              onClick={handleOpenA}
            >
              0.0022 ETH
            </button>
          </div>
        )}
        {(!chestType || chestType == 'B') && (
          <div className="text-white text-center text-3xl font-semibold basis-1/3 p-10">
            <div>0 / 100 000</div>
            <button
              className="px-6 py-2 mt-3 bg-white rounded-lg text-xl font-normal text-black hover:bg-opacity-70 transition-all"
              onClick={handleOpenB}
            >
              0.0066 ETH
            </button>
          </div>
        )}
        {(!chestType || chestType == 'C') && (
          <div className="text-white text-center text-3xl font-semibold basis-1/3 p-10">
            <div>0 / 30 000</div>
            <button
              className="px-6 py-2 mt-3 bg-white rounded-lg text-xl font-normal text-black hover:bg-opacity-70 transition-all"
              onClick={handleOpenC}
            >
              0.019 ETH
            </button>
          </div>
        )}
      </div>
    </>
  );
};

Launchpad.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;
export default Launchpad;
