import React, { useEffect, useState } from 'react';
import { type ItemType, useLemonStore } from '../../helpers/lemonStore';
import { shallow } from 'zustand/shallow';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import alchemy, { getItems, mintItemData } from '../../helpers/alchemy';
import { useAlert } from 'react-alert';
import { CssLoader } from '../CssLoader';

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
    <>
      <div className="inventory-left-buttons d-flex flex-column">
        <div className="col d-flex py-1" style={{ height: '33.33%' }}>
          <a
            href={'#'}
            className={`button justify-content-center w-100 d-flex`}
            onClick={handleMintItem}
          >
            <span className="justify-content-center align-self-center text-center w-100">
              Mint random item
            </span>
          </a>
        </div>
        <div className="col d-flex py-1" style={{ height: '33.33%' }}>
          <a
            href={'#'}
            className={`button justify-content-center w-100 d-flex`}
            onClick={handleDressedMode}
          >
            <span
              className={`justify-content-center align-self-center text-center w-100`}
            >
              {currentItemsFilter == 'dressed' ? 'Back' : 'Dressed items'}
            </span>
          </a>
        </div>
        <div className="col d-flex py-1" style={{ height: '33.33%' }}>
          <a
            href={'#'}
            className={`button justify-content-center w-100 d-flex ${
              selectedItem ? '' : 'disabled'
            }`}
          >
            <span className="justify-content-center align-self-center text-center w-100">
              {currentItemsFilter == 'dressed' ? 'Take Off' : 'Confirm'}
            </span>
          </a>
        </div>
      </div>
      <div className="inventory-scroll d-flex">
        {inventoryLoader ? (
          <CssLoader />
        ) : (
          <div className="row align-self-start w-100">
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
                      className={`col col-3 border px-1 px-1 ${
                        item.id == selectedItem?.id && 'selected'
                      }`}
                      key={`${item.type}${idx}`}
                    >
                      <div
                        className="link text-center py-2"
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
                  <div className="w-100 d-flex align-items-center">
                    <div
                      className="w-100 text-center pt-4 mt-2"
                      style={{ fontSize: '19px' }}
                    >
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
                      className={`col col-3 border px-1 px-1 ${
                        item.id == selectedItem?.id && 'selected'
                      }`}
                      key={`${item.type}${idx}`}
                    >
                      <div
                        className="link text-center py-2"
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
              </>
            )}
          </div>
        )}
      </div>

      <div className="position-absolute" style={{ bottom: '-70px' }}>
        {currentItemsFilter != 'dressed' && (
          <div className="d-flex mt-2 bottom-buttons">
            <a
              className={`col col-auto position-relative ${
                currentItemsFilter == undefined && 'active'
              }`}
              href={'#'}
              onClick={filterOutifts('all')}
            >
              <b
                className="position-absolute"
                style={{
                  color: '#4a5480',
                  padding: '19px 15px 0 16px',
                  fontSize: '17px',
                }}
              >
                ALL
              </b>
              <img
                src={`${process.env.NEXT_PUBLIC_STATIC}/assets/tiny/icon_hand_empty.png`}
              />
            </a>
            <a
              className={`col col-auto ${
                lemonItems.find(
                  (item) => item.type == 'cap' && !item.attachedTo
                )
                  ? 'enabled'
                  : 'disabled'
              } ${currentItemsFilter == 'cap' ? 'active' : ''}`}
              href={'#'}
              onClick={filterOutifts('cap')}
            >
              <img
                src={`${process.env.NEXT_PUBLIC_STATIC}/assets/tiny/icon_cap_64.png`}
              />
            </a>
            <a
              className={`col col-auto ${
                lemonItems.find(
                  (item) => item.type == 'belt' && !item.attachedTo
                )
                  ? 'enabled'
                  : 'disabled'
              } ${currentItemsFilter == 'belt' ? 'active' : ''}`}
              href={'#'}
              onClick={filterOutifts('belt')}
            >
              <img
                src={`${process.env.NEXT_PUBLIC_STATIC}/assets/tiny/icon_belt_64.png`}
              />
            </a>
            {/* <a className={`col col-auto ${lemonItems.find(item => item.type == 'hand' && !item.attachedTo) ? 'enabled' : 'disabled' } ${ currentItemsFilter == 'hand' ? 'active' : '' }`} href={'#'} onClick={filterOutifts('hand')}>
          <img src={`${process.env.NEXT_PUBLIC_STATIC}/assets/tiny/icon_hand_l_64.png`} />
        </a> */}
            <a
              className={`col col-auto ${
                lemonItems.find(
                  (item) => item.type == 'cloth' && !item.attachedTo
                )
                  ? 'enabled'
                  : 'disabled'
              } ${currentItemsFilter == 'cloth' ? 'active' : ''}`}
              href={'#'}
              onClick={filterOutifts('cloth')}
            >
              <img
                src={`${process.env.NEXT_PUBLIC_STATIC}/assets/tiny/icon_cloth_64.png`}
              />
            </a>
            <a
              className={`col col-auto ${
                lemonItems.find(
                  (item) => item.type == 'mask' && !item.attachedTo
                )
                  ? 'enabled'
                  : 'disabled'
              } ${currentItemsFilter == 'mask' ? 'active' : ''}`}
              href={'#'}
              onClick={filterOutifts('mask')}
            >
              <img
                src={`${process.env.NEXT_PUBLIC_STATIC}/assets/tiny/icon_mask_64.png`}
              />
            </a>
            <a
              className={`col col-auto ${
                lemonItems.find(
                  (item) => item.type == 'glasses' && !item.attachedTo
                )
                  ? 'enabled'
                  : 'disabled'
              } ${currentItemsFilter == 'glasses' ? 'active' : ''}`}
              href={'#'}
              onClick={filterOutifts('glasses')}
            >
              <img
                src={`${process.env.NEXT_PUBLIC_STATIC}/assets/tiny/icon_face_64.png`}
              />
            </a>
            <a
              className={`col col-auto ${
                lemonItems.find(
                  (item) => item.type == 'shoes' && !item.attachedTo
                )
                  ? 'enabled'
                  : 'disabled'
              } ${currentItemsFilter == 'shoes' ? 'active' : ''}`}
              href={'#'}
              onClick={filterOutifts('shoes')}
            >
              <img
                src={`${process.env.NEXT_PUBLIC_STATIC}/assets/tiny/icon_foot_64.png`}
              />
            </a>
            <a
              className={`col col-auto ${
                lemonItems.find(
                  (item) => item.type == 'back' && !item.attachedTo
                )
                  ? 'enabled'
                  : 'disabled'
              } ${currentItemsFilter == 'back' ? 'active' : ''}`}
              href={'#'}
              onClick={filterOutifts('back')}
            >
              <img
                src={`${process.env.NEXT_PUBLIC_STATIC}/assets/tiny/icon_back_128.png`}
              />
            </a>
            <a
              className={`col col-auto ${
                lemonItems.find(
                  (item) => item.type == 'fire_arms' && !item.attachedTo
                )
                  ? 'enabled'
                  : 'disabled'
              } ${currentItemsFilter == 'fire_arms' ? 'active' : ''}`}
              href={'#'}
              onClick={filterOutifts('fire_arms')}
            >
              <img
                src={`${process.env.NEXT_PUBLIC_STATIC}/assets/tiny/icon_hand_r_64.png`}
              />
            </a>
            <a
              className={`col col-auto ${
                lemonItems.find(
                  (item) => item.type == 'cold_arms' && !item.attachedTo
                )
                  ? 'enabled'
                  : 'disabled'
              } ${currentItemsFilter == 'cold_arms' ? 'active' : ''}`}
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
    </>
  );
};
