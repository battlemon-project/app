import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { craftGems, mintGem } from '../../helpers/linea';
import { getGems, getBalance } from '../../helpers/covalent';
import { useAlert } from 'react-alert';
import { CssLoader } from '../../components/CssLoader';
import { BabylonLoader } from '../../components/BabylonLoader';
import styles from './../../styles/Labs.module.css';
import classNames from 'classnames';

interface INft {
  id: string;
  image: string;
  grade: number;
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
  const { address } = useAccount();
  const [loader, setLoader] = useState<boolean>(true);
  const [animationForGem, setAnimationForGem] = useState<[boolean, number]>([
    false,
    0,
  ]);
  const [userGems, setUserGems] = useState<INft[]>([]);
  const [selectedGems, setSelectedGems] = useState<
    [string | null, string | null]
  >([null, null]);
  const { config: configMint } = usePrepareContractWrite(mintGem(address));
  const {
    data: dataMintGem,
    write: sendMintGems,
    isError: errorMintGem,
  } = useContractWrite(configMint);
  const { config: configCraft } = usePrepareContractWrite(
    craftGems(selectedGems[0], selectedGems[1])
  );
  const {
    data: dataCraftGems,
    write: sendCraftGems,
    isError: errorCraftGems,
  } = useContractWrite(configCraft);
  const [hasMounted, setHasMounted] = useState(false);
  const alert = useAlert();

  const { data: mintedGem, isSuccess: successMintGem } = useWaitForTransaction({
    hash: dataMintGem?.hash,
  });

  const { data: craftedGem, isSuccess: successCraftGems } =
    useWaitForTransaction({
      hash: dataCraftGems?.hash,
    });

  useEffect(() => {
    if (errorMintGem || successMintGem) {
      setSelectedGems([null, null]);
      setLoader(true);
      refreshGems();
    }
    console.log(mintedGem);
  }, [successMintGem, errorMintGem]);

  useEffect(() => {
    if (successCraftGems || errorCraftGems) {
      if (successCraftGems) {
        setAnimationForGem([
          true,
          (userGems.find((g) => g.id === selectedGems[0])?.grade ?? 0) + 1,
        ]);
        setTimeout(() => {
          setAnimationForGem([false, 0]);
        }, 4000);
      }
      setSelectedGems([null, null]);
      setLoader(true);
      refreshGems();
    }
  }, [errorCraftGems, successCraftGems]);

  const refreshGems = async () => {
    if (process.env.NEXT_PUBLIC_PRODUCTION == 'true') {
      return;
    }
    if (!address) return;
    await getBalance(address);

    // const nfts: INft[] = gems.ownedNfts.map((nft) => {
    //   const grade = parseInt(
    //     (nft.tokenUri?.gateway ?? 'https://example.com/nft/0')
    //       .split('/')
    //       .at(-1) as string
    //   );
    //   return {
    //     id: nft.tokenId,
    //     grade,
    //     image: gemImages[grade],
    //   };
    // });
    // setUserGems(nfts);
    setLoader(false);
  };

  const handleSelectGem = (id: string) => () => {
    if (selectedGems[0] == id) {
      selectedGems[0] = null;
    } else if (selectedGems[1] == id) {
      selectedGems[1] = null;
    } else if (selectedGems[0] == null) {
      selectedGems[0] = id;
    } else if (selectedGems[0] != null) {
      selectedGems[1] = id;
    }
    setSelectedGems([selectedGems[0], selectedGems[1]]);
  };

  const handleMint = async () => {
    setLoader(true);
    try {
      await sendMintGems?.();
    } catch (e) {
      const { message } = e as Error;
      alert.show(message, { type: 'error' });
      setLoader(false);
    }
  };

  const handleCraft = async () => {
    setLoader(true);
    try {
      await sendCraftGems?.();
    } catch (e) {
      const { message } = e as Error;
      alert.show(message, { type: 'error' });
      setLoader(false);
    }
  };

  useEffect(() => {
    setHasMounted(true);
    if (!address) return;
    refreshGems();
  }, [address]);

  if (!hasMounted) return <></>;

  return (
    <>
      {!address && <BabylonLoader isConnected={false} />}
      <div className={`container ${address ? '' : 'd-none'}`}>
        <div className={styles.container}>
          <div className={styles.inner__container}>
            <div className={styles.wrapper}>
              <div className={styles.left} style={{ width: '150px' }}>
                <div className={styles.left__item}>
                  {selectedGems[0] != null ? (
                    <img
                      src={`/resources/assets/gems/${
                        userGems.find((g) => g.id == selectedGems[0])?.image
                      }`}
                      alt="gem1"
                      className={styles.left__img}
                    />
                  ) : (
                    <div className={styles.left__icon}>+</div>
                  )}
                </div>
                <div className={styles.left__item}>
                  {selectedGems[1] != null ? (
                    <img
                      src={`/resources/assets/gems/${
                        userGems.find((u) => u.id == selectedGems[1])?.image
                      }`}
                      alt="gem1"
                      className={styles.left__img}
                    />
                  ) : (
                    <div className={styles.left__icon}>+</div>
                  )}
                </div>
              </div>
              <div className={styles.inner}>
                <div className={styles.tabs}>
                  <div className={styles.tab}>Info</div>
                  <div className={classNames(styles.tab, styles.active)}>
                    Items
                  </div>
                </div>
                <div className={styles.content}>
                  {loader ? (
                    <CssLoader />
                  ) : userGems.length === 0 ? (
                    <div
                      className="col text-center"
                      style={{ fontSize: '19px', color: '#fff' }}
                    >
                      You have not gems yet
                      {/* Click to PLUS for add sticker to Crafting */}
                    </div>
                  ) : (
                    <div className={styles.list}>
                      {userGems.map((gem) => (
                        <div
                          className={classNames(
                            { [styles.active]: selectedGems.includes(gem.id) },
                            styles.card
                          )}
                          key={gem.id}
                        >
                          <div
                            className="link text-center py-2"
                            onClick={handleSelectGem(gem.id)}
                            style={{ cursor: 'pointer' }}
                          >
                            <img
                              src={`/resources/assets/gems/${gem.image}`}
                              alt={gem.id}
                              className={styles.card__img}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="row ms-auto" style={{ maxWidth: '780px' }}>
                <div className="col-6">
                  <button
                    className={classNames(
                      {
                        [styles.active]:
                          !selectedGems.includes(null) &&
                          userGems.find((g) => g.id == selectedGems[0])
                            ?.image ==
                            userGems.find((g) => g.id == selectedGems[1])
                              ?.image,
                      },
                      styles.craft
                    )}
                    onClick={handleCraft}
                  >
                    <CraftIcon />
                    Craft
                  </button>
                </div>
                <div className="col-6">
                  <button
                    className={classNames(
                      {
                        [styles.active]:
                          !selectedGems.includes(null) &&
                          userGems.find((g) => g.id == selectedGems[0])
                            ?.image ==
                            userGems.find((g) => g.id == selectedGems[1])
                              ?.image,
                      },
                      styles.craft
                    )}
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

      <div
        className="modal"
        style={{ display: animationForGem[0] ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content position-relative"
            style={{ width: 'auto', margin: '0 auto' }}
          >
            <img
              src={`/resources/video/Appearing_VFX_A.gif`}
              alt="gem1"
              className="img-fluid"
            />
            <img
              src={`/resources/assets/gems/${gemImages[animationForGem[1]]}`}
              alt="gem1"
              className="img-fluid position-absolute"
              style={{
                transform: 'translate(-50%, -50%)',
                left: '50%',
                top: '50%',
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const CraftIcon: React.FC = () => {
  return (
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
      />
    </svg>
  );
};

Labs.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;
export default Labs;
