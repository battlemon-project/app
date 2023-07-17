import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { BabylonLoader } from '../../components/BabylonLoader';
import { CssLoader } from '../../components/CssLoader';
import { PickAxeCard } from '../../components/PickAxeCard/PickAxeCard';
import MiningScene from '../../scenes/MiningScene';
import classNames from 'classnames';
import useMining, { INft, useMiningStore } from '../../hooks/useMining';
import { useAuth } from '../../hooks/useAuth';
import { TransactionReceipt } from 'viem';

const Labs = () => {
  const {
    chipOff,
    successChipOff,
    sharp,
    successSharp,
    getSharpnessOf,
    getPickAxesList,
    chipOffData,
    getGemRank,
  } = useMining();
  const {
    startGemAppear,
    startMining,
    showPickAxe,
    startSharp,
    stopSharp,
    startUnsuccess,
  } = useMiningStore();
  const { isAuthorized } = useAuth();
  const [loader, setLoader] = useState<boolean>(true);
  const [loaderSharpness, setLoaderSharpness] = useState<boolean>(false);
  const [userPickAxes, setUserPickAxes] = useState<INft[]>([]);
  const [selectedSharpness, setSelectedSharpness] = useState<
    number | undefined
  >();
  const [selectedPickAxe, setSelectedPickAxe] = useState<INft | undefined>();

  const refreshPickAxes = async () => {
    setLoader(true);
    const pickAxes = await getPickAxesList?.();
    pickAxes && setUserPickAxes(pickAxes);
    setLoader(false);
  };

  const updateSharpness = async (tokenId: string) => {
    const sharpness = await getSharpnessOf?.(tokenId);
    setSelectedSharpness(sharpness);
    setLoaderSharpness(false);
  };

  const handleSelectPickAxe = (pickAxe: INft) => async () => {
    showPickAxe?.(pickAxe.meta);
    setSelectedPickAxe(pickAxe);
    updateSharpness(pickAxe.tokenId);
  };

  const handleMint = async () => {
    if (!selectedPickAxe) return;
    setLoaderSharpness(true);
    startMining?.(selectedPickAxe.meta);
    await chipOff?.(selectedPickAxe.tokenId);
  };

  const handleSharp = async () => {
    if (!selectedPickAxe) return;
    setLoaderSharpness(true);
    startSharp?.(selectedPickAxe.meta);
    await sharp?.(selectedPickAxe);
  };

  const startSuccess = async (
    chipOffData: TransactionReceipt
  ): Promise<void> => {
    const tokenId = parseInt(chipOffData.logs[0].topics[3] || '0');
    const rank = await getGemRank?.(tokenId.toString());
    if (rank !== undefined) {
      startGemAppear?.(rank);
    }
    if (selectedPickAxe) {
      updateSharpness(selectedPickAxe.tokenId);
    }
  };

  useEffect(() => {
    if (!successChipOff || !selectedPickAxe) return;
    console.log(123123123123);
    console.log(chipOffData?.logs);

    if (
      chipOffData &&
      chipOffData.logs?.length &&
      chipOffData.logs[0].topics.length > 3
    ) {
      startSuccess(chipOffData);
    } else {
      startUnsuccess?.();
      updateSharpness(selectedPickAxe.tokenId);
    }
  }, [successChipOff]);

  useEffect(() => {
    if (!successSharp || !selectedPickAxe) return;
    updateSharpness(selectedPickAxe.tokenId);
    stopSharp?.(selectedPickAxe.meta);
  }, [successSharp]);

  useEffect(() => {
    if (isAuthorized && !!getPickAxesList) {
      refreshPickAxes();
    }
  }, [isAuthorized, !!getPickAxesList]);

  if (!isAuthorized) return <BabylonLoader isConnected={false} />;

  return (
    <>
      <MiningScene />
      <div className="container mx-auto px-4">
        <div className="max-w-96 w-96 float-right flex flex-col lg:flex-row items-center pt-24">
          <div className="w-full relative" style={{ zIndex: 999 }}>
            <div
              className="border border-white border-opacity-20 rounded-3xl mb-6"
              style={{
                background:
                  'linear-gradient(90.66deg,hsla(0,0%,100%,.3) .57%,hsla(0,0%,100%,.1) 99.48%',
              }}
            >
              <div className="items-center border-b border-white border-opacity-20 p-4 text-white font-semibold uppercase">
                <div className="flex flex-none">
                  <span className="flex-none text-opacity-50">Pick Axe</span>
                  {selectedSharpness && (
                    <>
                      <span className="flex-none text-opacity-50 pl-2">
                        Sharpness:
                      </span>
                      <div className="flex-1 pl-2">
                        <div
                          className="w-full"
                          style={{ border: '1px solid rgba(255,255,255,0.4)' }}
                        >
                          <div
                            className="h-5 p-0.5 text-center leading-none text-primary-100"
                            style={{
                              width: selectedSharpness + '%',
                              background:
                                'linear-gradient(105.54deg,#594b8f,#6b6198)',
                            }}
                          >
                            {loaderSharpness ? (
                              <>
                                <span
                                  style={{ position: 'relative', top: '-3px' }}
                                >
                                  <CssLoader size={0.15} />
                                </span>
                              </>
                            ) : (
                              <>{selectedSharpness}%</>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-center min-h-96 overflow-y-auto h-96">
                {loader ? (
                  <CssLoader />
                ) : userPickAxes.length === 0 ? (
                  <div className="text-white">You have not axes yet</div>
                ) : (
                  <div className="grid grid-cols-4 gap-2.5 p-1.5 w-full h-fit self-start">
                    {userPickAxes.map((pickAxe) => (
                      <div key={pickAxe.tokenId}>
                        <PickAxeCard
                          id={pickAxe.tokenId}
                          onClick={handleSelectPickAxe(pickAxe)}
                          image={pickAxe.image}
                          isActive={selectedPickAxe?.tokenId == pickAxe.tokenId}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="flex" style={{ maxWidth: '780px' }}>
                <div className="basis-1/2 pr-2">
                  <button
                    className={classNames(
                      'pointer-events-auto flex items-center justify-center p-5 gap-2 rounded-xl w-full font-bold uppercase text-white border border-white border-opacity-50 transition-all disabled:opacity-25'
                    )}
                    onClick={handleSharp}
                    disabled={!selectedPickAxe}
                  >
                    <svg
                      width="23"
                      height="22"
                      viewBox="0 0 23 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 21V16M4 6V1M1.5 3.5H6.5M1.5 18.5H6.5M12.5 2L10.7658 6.50886C10.4838 7.24209 10.3428 7.60871 10.1235 7.91709C9.92919 8.1904 9.6904 8.42919 9.41709 8.62353C9.10871 8.84281 8.74209 8.98381 8.00886 9.26582L3.5 11L8.00886 12.7342C8.74209 13.0162 9.10871 13.1572 9.41709 13.3765C9.6904 13.5708 9.92919 13.8096 10.1235 14.0829C10.3428 14.3913 10.4838 14.7579 10.7658 15.4911L12.5 20L14.2342 15.4911C14.5162 14.7579 14.6572 14.3913 14.8765 14.0829C15.0708 13.8096 15.3096 13.5708 15.5829 13.3765C15.8913 13.1572 16.2579 13.0162 16.9911 12.7342L21.5 11L16.9911 9.26582C16.2579 8.98381 15.8913 8.8428 15.5829 8.62353C15.3096 8.42919 15.0708 8.1904 14.8765 7.91709C14.6572 7.60871 14.5162 7.24209 14.2342 6.50886L12.5 2Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                    Sharp Axe
                  </button>
                </div>
                <div className="basis-1/2 pl-2">
                  <button
                    className={classNames(
                      'flex items-center justify-center p-5 gap-2 rounded-xl w-full font-bold uppercase text-white border border-white border-opacity-50 transition-all disabled:opacity-25'
                    )}
                    style={{
                      background: 'linear-gradient(105.54deg,#594b8f,#6b6198)',
                    }}
                    onClick={handleMint}
                    disabled={!selectedPickAxe}
                  >
                    Start Mining
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Labs.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;
export default Labs;
