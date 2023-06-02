import React, { useEffect, useState } from 'react';
import { useLemonStore } from '../../helpers/lemonStore';
import { shallow } from 'zustand/shallow';
import { LemonInfo } from './LemonInfo';
import { LemonItems } from './LemonItems';
import classNames from 'classnames';

export const Inventory: React.FC = () => {
  const { lemons, activePlatform } = useLemonStore(
    ({ inventoryIsOpened, lemons, activePlatform }) => ({
      inventoryIsOpened,
      lemons,
      activePlatform,
    }),
    shallow
  );
  const [currentTab, setCurrentTab] = useState<string>('info');

  const changeTab = (tab: string) => (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setCurrentTab(tab);
  };

  useEffect(() => {
    const unsubscribe = useLemonStore.subscribe((state, prevState) => {
      if (state.inventoryIsOpened != prevState.inventoryIsOpened) {
        setCurrentTab('info');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!lemons?.ownedNfts?.length) {
    return <></>;
  }

  console.log(currentTab);

  return (
    <div className="w-full">
      <div className="justify-center self-center w-100">
        <div className="flex mb-2 gap-1.5">
          <a
            href={`#`}
            className={classNames(
              {
                'bg-orange-200': currentTab === 'info',
                'bg-slate-100': currentTab !== 'info',
              },
              'flex py-4 px-4 rounded-3xl border-2 border-slate-400 uppercase'
            )}
            onClick={changeTab('info')}
          >
            <span
              className="justify-center self-center text-center w-full"
              style={{ color: '#000' }}
            >
              INFO
            </span>
          </a>
          <a
            href={`#`}
            className={classNames(
              {
                'bg-orange-200': currentTab === 'items',
                'bg-slate-100': currentTab !== 'items',
              },
              'flex py-4 px-4 rounded-3xl border-2 border-slate-400 uppercase'
            )}
            onClick={changeTab('items')}
          >
            <span
              className="justify-center self-center text-center w-full"
              style={{ color: '#000' }}
            >
              ITEMS
            </span>
          </a>
          <a
            href={`/game/home?playerId=${JSON.stringify(
              lemons?.ownedNfts[activePlatform - 1]
            )}`}
            rel="noreferrer"
            target="_blank"
            className={classNames(
              'flex py-4 px-4 rounded-3xl bg-slate-100 border-2 border-slate-400 uppercase'
            )}
          >
            <span
              className="justify-center self-center text-center w-full"
              style={{ color: '#000' }}
            >
              PLAY
            </span>
          </a>
          <a
            href={'#'}
            className={classNames(
              {
                'bg-orange-200': currentTab === 'rent',
                'bg-slate-100': currentTab !== 'rent',
              },
              'flex py-4 px-4 rounded-3xl border-2 border-slate-400 uppercase'
            )}
            onClick={changeTab('rent')}
          >
            <span
              className="justify-center self-center text-center w-full"
              style={{ color: '#000' }}
            >
              RENT
            </span>
          </a>
          <a
            href={`#`}
            className={classNames(
              {
                'bg-orange-200': currentTab === 'sell',
                'bg-slate-100': currentTab !== 'sell',
              },
              'flex py-4 px-4 rounded-3xl border-2 border-slate-400 uppercase'
            )}
            onClick={changeTab('sell')}
          >
            <span
              className="justify-center self-center text-center w-full"
              style={{ color: '#000' }}
            >
              SELL
            </span>
          </a>
          <a
            href={`#`}
            className={classNames(
              {
                'bg-orange-200': currentTab === 'change',
                'bg-slate-100': currentTab !== 'change',
              },
              'flex py-4 px-4 rounded-3xl border-2 border-slate-400 uppercase'
            )}
            onClick={changeTab('change')}
          >
            <span
              className="justify-center self-center text-center w-100"
              style={{ color: '#000' }}
            >
              CHANGE
            </span>
          </a>
          <a
            href={`#`}
            className={classNames(
              {
                'bg-orange-200': currentTab === 'send',
                'bg-slate-100': currentTab !== 'send',
              },
              'flex py-4 px-4 rounded-3xl border-2 border-slate-400 uppercase'
            )}
            onClick={changeTab('send')}
          >
            <span
              className="justify-center self-center text-center w-full"
              style={{ color: '#000' }}
            >
              SEND
            </span>
          </a>
        </div>

        <div>
          {(() => {
            switch (currentTab) {
              case 'info':
                return <LemonInfo />;
              case 'items':
                return <LemonItems />;
              default:
                null;
            }
          })()}
        </div>
      </div>
    </div>
  );
};
