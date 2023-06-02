import React, { useEffect, useState } from 'react';
import { type ItemType, useLemonStore } from '../../helpers/lemonStore';
import { shallow } from 'zustand/shallow';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import alchemy, { getItems, mintItemData } from '../../helpers/alchemy';
import { useAlert } from 'react-alert';
import { CssLoader } from '../CssLoader';
import classNames from 'classnames';
import Image from 'next/image';

export const LemonItems: React.FC = () => {
  const { lemons, activePlatform } = useLemonStore(
    ({ lemons, activePlatform, wearingItem }) => ({
      lemons,
      activePlatform,
      wearingItem,
    }),
    shallow
  );

  const [currentItemsFilter, setCurrentItemsFilter] = useState<
    string | undefined
  >();
  const [inventoryLoader, setInventoryLoader] = useState<boolean>(true);
  const [lemonItems, setLemonItems] = useState<ItemType[]>([]);
  const [selectedItem, setSelectedItem] = useState<ItemType | undefined>();
  const { address } = useAccount();
  const alert = useAlert();

  const filterOutifts =
    (type: string) => (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      if (type == 'all') {
        setCurrentItemsFilter(undefined);
      } else {
        setCurrentItemsFilter(type);
      }
    };

  const clickToItem =
    (item: ItemType) => (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      setSelectedItem(item);
      if (currentItemsFilter != 'dressed') {
        useLemonStore.setState({ wearingItem: item });
      }
    };

  const refreshItems = async () => {
    if (process.env.NEXT_PUBLIC_PRODUCTION == 'true') {
      return;
    }
    if (!address) return;
    const itemsOwnedNfts = await getItems(address);
    const items = itemsOwnedNfts.ownedNfts
      .map((nft) => nft.rawMetadata.properties)
      .filter((x) => x);
    setLemonItems(items);
    setInventoryLoader(false);
  };

  const handleDressedMode = () => {
    setSelectedItem(undefined);
    useLemonStore.setState({ wearingItem: undefined });
    if (currentItemsFilter == 'dressed') {
      setCurrentItemsFilter(undefined);
    } else {
      setCurrentItemsFilter('dressed');
    }
  };

  const { config } = usePrepareContractWrite(
    mintItemData(address, lemonItems.length)
  );
  const { write } = useContractWrite(config);

  const handleMintItem = async () => {
    if (process.env.NEXT_PUBLIC_PRODUCTION == 'true') {
      return false;
    }
    setInventoryLoader(true);

    try {
      await write?.();
      setCurrentItemsFilter(undefined);
    } catch (e) {
      const { message } = e as Error;
      alert.show(message, { type: 'error' });
      setInventoryLoader(false);
    }
  };

  useEffect(() => {
    refreshItems();
    alchemy.ws.on(
      {
        address: '0xeae26aa7aD3E54C208a22a78bd9E5d2D7ccFC18D',
        topics: [
          '0xe65085e689b77b126ba0bac3b079aa8288f19f4d5445af11c76003f8ab3075dd',
          '0x0000000000000000000000000000000000000000000000000000000000000001',
        ],
      },
      (tx) => {
        setInventoryLoader(true);
        refreshItems();
      }
    );
  }, []);

  return (
    <div className="flex max-w-3xl w-full">
      <div className="top-20 absolute w-28 -top-1 -bottom-1 -left-32 flex flex-col">
        <div className="col flex py-1" style={{ height: '33.33%' }}>
          <a
            href={'#'}
            className="bg-white bg-opacity-60 text-center rounded-md text-xl justify-center w-full flex text-black border border-white border-opacity-80"
            onClick={handleMintItem}
          >
            <span className="justify-center self-center text-center w-full">
              Mint random item
            </span>
          </a>
        </div>
        <div className="flex py-1" style={{ height: '33.33%' }}>
          <a
            href={'#'}
            className="bg-white bg-opacity-60 text-center rounded-md text-xl justify-center w-full flex text-black border border-white border-opacity-80"
            onClick={handleDressedMode}
          >
            <span className="justify-center self-center text-center w-full">
              {currentItemsFilter == 'dressed' ? 'Back' : 'Dressed items'}
            </span>
          </a>
        </div>
        <div className="flex py-1" style={{ height: '33.33%' }}>
          <a
            href={'#'}
            className={classNames(
              {
                'bg-stone-400 bg-opacity-40': !selectedItem,
                'bg-white bg-opacity-60': selectedItem,
              },
              'text-center rounded-md text-xl justify-center w-full flex text-black border border-white border-opacity-80'
            )}
          >
            <span className="justify-center self-center text-center w-full">
              {currentItemsFilter == 'dressed' ? 'Take Off' : 'Confirm'}
            </span>
          </a>
        </div>
      </div>
      <div className="flex w-full items-center justify-center bg-white bg-opacity-50 min-h-50 h-90 overflow-y-auto rounded-md">
        {inventoryLoader ? (
          <CssLoader />
        ) : (
          <div className="grid grid-cols-12 self-start w-full">
            {currentItemsFilter == 'dressed' ? (
              <>
                {lemonItems
                  .filter(
                    (item) =>
                      item.attachedTo ==
                      lemons.ownedNfts[activePlatform - 1].tokenId
                  )
                  .map((item, idx) => (
                    <div
                      className={classNames({
                        'bg-white border-opacity-80 col-span-3 border px-1':
                          item.id === selectedItem?.id,
                      })}
                      key={`${item.type}${idx}`}
                    >
                      <div
                        className="text-center py-2"
                        onClick={clickToItem(item)}
                        style={{ cursor: 'pointer' }}
                      >
                        <img
                          src={`${process.env.NEXT_PUBLIC_STATIC}/assets/128/Icon_${item.name}_128.png`}
                          alt={item.type}
                          className="img-fluid"
                        />
                      </div>
                    </div>
                  ))}
                {lemonItems.filter(
                  (item) =>
                    item.attachedTo ==
                    lemons.ownedNfts[activePlatform - 1].tokenId
                ).length == 0 ? (
                  <div className="w-full flex align-items-center col-span-full">
                    <div className="w-full text-center pt-4 mt-2 text-lg">
                      {"Lemon doesn't have dresset items"}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <>
                {lemonItems
                  .filter(
                    (item) =>
                      (!currentItemsFilter ||
                        currentItemsFilter == item.type) &&
                      !item.attachedTo
                  )
                  .map((item, idx) => (
                    <div
                      className={classNames(
                        {
                          'bg-white bg-opacity-80':
                            item.id === selectedItem?.id,
                        },
                        'col-span-3 border px-1'
                      )}
                      key={`${item.type}${idx}`}
                    >
                      <div
                        className="text-center py-2 cursor-pointer"
                        onClick={clickToItem(item)}
                      >
                        <Image
                          src={`${process.env.NEXT_PUBLIC_STATIC}/assets/128/Icon_${item.name}_128.png`}
                          alt={item.type}
                          width={128}
                          height={128}
                        />
                      </div>
                    </div>
                  ))}
              </>
            )}
          </div>
        )}
      </div>

      <div className="absolute -bottom-20">
        {currentItemsFilter != 'dressed' && (
          <div className="flex shrink-0 mt-2 bottom-buttons">
            <a
              className={classNames(
                {
                  'bg-yellow-400 opacity-80': currentItemsFilter === undefined,
                },
                'relative flex items-center justify-center basis-16 w-16 h-16 rounded-full'
              )}
              href={'#'}
              onClick={filterOutifts('all')}
            >
              <b className="relative z-10">ALL</b>
              <Image
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                width={63}
                height={63}
                alt="icon"
                src={`${process.env.NEXT_PUBLIC_STATIC}/assets/tiny/icon_hand_empty.png`}
              />
            </a>
            <a
              className={classNames(
                {
                  'bg-yellow-400 opacity-80': currentItemsFilter === 'cap',
                },
                'relative flex items-center justify-center basis-16 w-16 h-16 rounded-full cursor-pointer'
              )}
              onClick={filterOutifts('cap')}
            >
              <img
                src={`${process.env.NEXT_PUBLIC_STATIC}/assets/tiny/icon_cap_64.png`}
              />
            </a>
            <a
              className={classNames(
                {
                  'bg-yellow-400 opacity-80': currentItemsFilter === 'belt',
                },
                'relative flex items-center justify-center basis-16 w-16 h-16 rounded-full'
              )}
              href={'#'}
              onClick={filterOutifts('belt')}
            >
              <img
                src={`${process.env.NEXT_PUBLIC_STATIC}/assets/tiny/icon_belt_64.png`}
              />
            </a>
            <a
              className={classNames(
                {
                  'bg-yellow-400 opacity-80': currentItemsFilter === 'cloth',
                },
                'relative flex items-center justify-center basis-16 w-16 h-16 rounded-full'
              )}
              href={'#'}
              onClick={filterOutifts('cloth')}
            >
              <img
                src={`${process.env.NEXT_PUBLIC_STATIC}/assets/tiny/icon_cloth_64.png`}
              />
            </a>
            <a
              className={classNames(
                {
                  'bg-yellow-400 opacity-80': currentItemsFilter === 'mask',
                },
                'relative flex items-center justify-center basis-16 w-16 h-16 rounded-full'
              )}
              href={'#'}
              onClick={filterOutifts('mask')}
            >
              <img
                src={`${process.env.NEXT_PUBLIC_STATIC}/assets/tiny/icon_mask_64.png`}
              />
            </a>
            <a
              className={classNames(
                {
                  'bg-yellow-400 opacity-80': currentItemsFilter === 'glasses',
                },
                'relative flex items-center justify-center basis-16 w-16 h-16 rounded-full'
              )}
              href={'#'}
              onClick={filterOutifts('glasses')}
            >
              <img
                src={`${process.env.NEXT_PUBLIC_STATIC}/assets/tiny/icon_face_64.png`}
              />
            </a>
            <a
              className={classNames(
                {
                  'bg-yellow-400 opacity-80': currentItemsFilter === 'shoes',
                },
                'relative flex items-center justify-center basis-16 w-16 h-16 rounded-full'
              )}
              href={'#'}
              onClick={filterOutifts('shoes')}
            >
              <img
                src={`${process.env.NEXT_PUBLIC_STATIC}/assets/tiny/icon_foot_64.png`}
              />
            </a>
            <a
              className={classNames(
                {
                  'bg-yellow-400 opacity-80': currentItemsFilter === 'back',
                },
                'relative flex items-center justify-center basis-16 w-16 h-16 rounded-full'
              )}
              href={'#'}
              onClick={filterOutifts('back')}
            >
              <img
                src={`${process.env.NEXT_PUBLIC_STATIC}/assets/tiny/icon_back_128.png`}
              />
            </a>
            <a
              className={classNames(
                {
                  'bg-yellow-400 opacity-80':
                    currentItemsFilter === 'fire_arms',
                },
                'relative flex items-center justify-center basis-16 w-16 h-16 rounded-full'
              )}
              href={'#'}
              onClick={filterOutifts('fire_arms')}
            >
              <img
                src={`${process.env.NEXT_PUBLIC_STATIC}/assets/tiny/icon_hand_r_64.png`}
              />
            </a>
            <a
              className={classNames(
                {
                  'bg-yellow-400 opacity-80':
                    currentItemsFilter === 'cold_arms',
                },
                'relative flex items-center justify-center basis-16 w-16 h-16 rounded-full'
              )}
              href={'#'}
              onClick={filterOutifts('cold_arms')}
            >
              <img
                src={`${process.env.NEXT_PUBLIC_STATIC}/assets/tiny/icon_cold_arms_64.png`}
              />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
