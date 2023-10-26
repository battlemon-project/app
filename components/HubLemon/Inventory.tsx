import React, { useState } from 'react';
import { useLemonStore } from '../../helpers/lemonStore';
import { shallow } from 'zustand/shallow';
import classNames from 'classnames';
import { InfoTab } from './InventoryTabs/InfoTab/InfoTab';
import { ItemsTab } from './InventoryTabs/ItemsTab/ItemsTab';

type TabsNames =
  | 'INFO'
  | 'ITEMS'
  | 'PLAY'
  | 'RENT'
  | 'SELL'
  | 'CHANGE'
  | 'SEND';
interface TabType {
  name: TabsNames;
  href?: string;
}

export const Inventory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabsNames>('ITEMS');

  const { lemon } = useLemonStore(
    ({ inventoryIsOpened, lemon }) => ({
      inventoryIsOpened,
      lemon
    }),
    shallow
  );

  const TABS: TabType[] = [
    {
      name: 'INFO',
    },
    {
      name: 'ITEMS',
    },
    {
      name: 'PLAY',
      // href: `/game/home?playerId=${JSON.stringify(
      //   lemon?.id
      // )}`,
    },
    {
      name: 'RENT',
    },
    {
      name: 'SELL',
    },
    {
      name: 'CHANGE',
    },
    {
      name: 'SEND',
    },
  ];

  return (
    <div
      className="rounded-xl border-white border-opacity-20 border-2 overflow-hidden"
      style={{
        background:
          'linear-gradient(to right, rgba(255, 255, 255, .20), rgba(255, 255, 255, .05))',
      }}
    >
      <div className="px-5 border-b border-white border-opacity-20 flex justify-center">
        {TABS.map((tab) =>
          tab.href ? (
            <a
              key={tab.name}
              href={tab.href}
            >
              {tab.name}
            </a>
          ) : (
            <button
              className={classNames(
                {
                  'text-opacity-100': tab.name === activeTab,
                  'text-opacity-50': tab.name !== activeTab,
                },
                'relative text-white px-3 py-3 font-semibold flex-grow text-center'
              )}
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
            >
              {tab.name}
              {tab.name === activeTab ? (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-full bg-white"></div>
              ) : null}
            </button>
          )
        )}
      </div>
      <div>
        {activeTab === 'INFO' ? (
          <InfoTab
            items={
              lemon?.properties ||
              []
            }
          />
        ) : activeTab === 'ITEMS' ? (
          <ItemsTab />
        ) : null}
      </div>
    </div>
  );
};
