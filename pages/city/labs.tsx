import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { useAccount, useSigner } from 'wagmi';
import FREE_GEMS_CONTRACT_SOL from '../../helpers/abi/FreeGem.json';
import { FREE_GEMS_CONTRACT_ADDRESS } from '../../helpers/linea';
import { BabylonLoader } from '../../components/BabylonLoader';
import { CssLoader } from '../../components/CssLoader';
import { GemItemCard } from '../../components/GemItemCard/GemItemCard';
import Image from 'next/image';
import classNames from 'classnames';
import { ethers, utils } from 'ethers';
import { useRouter } from 'next/router';

interface INft {
  id: string;
  image: string;
  tokenId: string;
  meta: number;
}

const gemImages: Record<number, string> = {
  0: 'BTLN_Gem_Green_A_128.png',
  1: 'BTLN_Gem_Blue_A_128.png',
  2: 'BTLN_Gem_Yellow_A_128.png',
  3: 'BTLN_Gem_Purple_A_128.png',
  4: 'BTLN_Gem_Orange_A_128.png',
  5: 'BTLN_Gem_Red_A_128.png',
  6: 'BTLN_Gem_Sky_A_128.png',
};

const Labs = () => {
  const { address, status } = useAccount();
  const [contract, setContract] = useState<ethers.Contract>();
  const { data: signer } = useSigner();
  const [loader, setLoader] = useState<boolean>(true);
  const [userGems, setUserGems] = useState<INft[]>([]);
  const [selectedGems, setSelectedGems] = useState<
    [string | null, string | null]
  >([null, null]);

  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();

  if (status === 'disconnected') {
    router.replace('/');
  }

  const refreshGems = async () => {
    if (!address) return;
    const data = await fetch(`/api/linea/gems?address=${address}`);
    const {
      result: {
        data: { token721S: gems },
      },
    } = await data.json();
    await getMetadata(gems);
    setLoader(false);
  };

  const handleSelectGem = (tokenId: string) => () => {
    if (selectedGems[0] == tokenId) {
      selectedGems[0] = null;
    } else if (selectedGems[1] == tokenId) {
      selectedGems[1] = null;
    } else if (selectedGems[0] == null) {
      selectedGems[0] = tokenId;
    } else if (selectedGems[0] != null) {
      selectedGems[1] = tokenId;
    }
    setSelectedGems([selectedGems[0], selectedGems[1]]);
  };

  const handleMint = async () => {
    if (!contract) return;
    setLoader(true);
    try {
      const mint = await contract.mint(address, 1);
      const receipt = await mint.wait(1);
    } catch (e) {
      const { message } = e as Error;
      console.log(message);
    }
    refreshGems();
  };

  const handleCraft = async () => {
    if (!contract) return;
    setLoader(true);
    try {
      console.log(selectedGems);
      const craft = await contract.merge(selectedGems[0], selectedGems[1], {
        value: utils.parseEther('0.0005'),
      });
      const receipt = await craft.wait();
    } catch (e) {
      const { message } = e as Error;
      console.log(message);
    }
    setSelectedGems([null, null]);
    setLoader(true);
    refreshGems();
  };

  const getMetadata = async (gems: INft[]) => {
    if (!contract) return;
    const promises = gems.map(async (gem) => {
      if (!gem.tokenId) {
        gem.image = gemImages[0];
        return gem;
      }
      const metaURI = await contract.tokenURI(gem.tokenId);
      gem.meta = parseInt(metaURI.split('/').at(-1) as string);
      gem.image = gemImages[gem.meta];
      return gem;
    });
    await Promise.all(promises);
    setUserGems(gems);
  };

  useEffect(() => {
    setHasMounted(true);
    if (!address || !contract) return;
    refreshGems();
  }, [contract]);

  useEffect(() => {
    if (!signer || !address) return;
    const _contract = new ethers.Contract(
      FREE_GEMS_CONTRACT_ADDRESS,
      FREE_GEMS_CONTRACT_SOL.abi,
      signer
    );
    setContract(_contract);
  }, [signer, address]);

  if (!hasMounted) return <></>;

  return (
    <>
      {address ? (
        <>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-8 items-center pt-24">
              <div className="flex lg:block lg:basis-36 shrink-0 gap-8">
                <div
                  className="flex items-center justify-center border border-white border-opacity-20 rounded-2xl w-36 h-36 mb-3 backdrop-blur-lg"
                  style={{
                    background:
                      'linear-gradient(105.54deg,hsla(0,0%,100%,.45),hsla(0,0%,100%,.15))',
                  }}
                >
                  {selectedGems[0] !== null ? (
                    <Image
                      width={80}
                      height={80}
                      src={`/resources/assets/gems/${
                        userGems.find((u) => u.tokenId == selectedGems[0])
                          ?.image
                      }`}
                      alt="gem0"
                    />
                  ) : (
                    <div className="flex items-center justify-center pb-1 border border-white opacity-20 w-10 h-10 font-bold rounded-full text-white">
                      +
                    </div>
                  )}
                </div>
                <div
                  className="flex items-center justify-center border border-white border-opacity-20 rounded-2xl w-36 h-36 backdrop-blur-lg"
                  style={{
                    background:
                      'linear-gradient(105.54deg,hsla(0,0%,100%,.45),hsla(0,0%,100%,.15))',
                  }}
                >
                  {selectedGems[1] !== null ? (
                    <Image
                      width={80}
                      height={80}
                      src={`/resources/assets/gems/${
                        userGems.find((u) => u.tokenId == selectedGems[1])
                          ?.image
                      }`}
                      alt="gem1"
                    />
                  ) : (
                    <div className="flex items-center justify-center pb-1 border border-white opacity-20 w-10 h-10 font-bold rounded-full text-white">
                      +
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full">
                <div
                  className="border border-white border-opacity-20 rounded-3xl mb-6"
                  style={{
                    background:
                      'linear-gradient(90.66deg,hsla(0,0%,100%,.3) .57%,hsla(0,0%,100%,.1) 99.48%',
                  }}
                >
                  <div className="flex items-center border-b border-white border-opacity-20 px-4">
                    <div className="basis-1/2 p-4 text-center font-semibold text-white text-opacity-50 uppercase">
                      Info
                    </div>
                    <div className="relative basis-1/2 py-4 text-center font-semibold text-white text-opacity-50 uppercase">
                      Items
                      <div className="absolute h-px w-full bottom-0 left-0 bg-white"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center min-h-96 overflow-y-auto">
                    {loader ? (
                      <CssLoader />
                    ) : userGems.length === 0 ? (
                      <div className="text-white">You have not gems yet</div>
                    ) : (
                      <div className="grid grid-cols-12 md:grid-cols-10 gap-2.5 p-1.5 w-full h-fit self-start">
                        {userGems.map((gem) => (
                          <div
                            className="col-span-full xs:col-span-6 sm:col-span-3 md:col-span-2"
                            key={gem.tokenId}
                          >
                            <GemItemCard
                              id={gem.tokenId}
                              onClick={handleSelectGem(gem.tokenId)}
                              imageURL={`/resources/assets/gems/${gem.image}`}
                              isActive={selectedGems.includes(gem.tokenId)}
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
                          {
                            'pointer-events-auto':
                              !selectedGems.includes(null) &&
                              userGems.find((g) => g.tokenId == selectedGems[0])
                                ?.image ==
                                userGems.find(
                                  (g) => g.tokenId == selectedGems[1]
                                )?.image,
                          },
                          'pointer-events-none flex items-center justify-center p-5 gap-2 rounded-xl w-full font-bold uppercase text-white border border-white border-opacity-50 transition-all'
                        )}
                        style={{
                          background:
                            !selectedGems.includes(null) &&
                            userGems.find((g) => g.tokenId == selectedGems[0])
                              ?.image ==
                              userGems.find((g) => g.tokenId == selectedGems[1])
                                ?.image
                              ? 'linear-gradient(105.54deg,#594b8f,#6b6198)'
                              : 'linear-gradient(105.54deg,hsla(0,0%,100%,.3),hsla(0,0%,100%,.1))',
                        }}
                        onClick={handleCraft}
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
                        Craft
                      </button>
                    </div>
                    <div className="basis-1/2 pl-2">
                      <button
                        className={classNames(
                          'flex items-center justify-center p-5 gap-2 rounded-xl w-full font-bold uppercase text-white border border-white border-opacity-50 transition-all'
                        )}
                        style={{
                          background:
                            'linear-gradient(105.54deg,#594b8f,#6b6198)',
                        }}
                        onClick={handleMint}
                      >
                        Mint
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <BabylonLoader isConnected={false} />
      )}
    </>
  );
};

Labs.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;
export default Labs;
