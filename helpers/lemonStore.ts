import { create } from 'zustand';
import type { LemonOwnedNftsResponse } from './alchemy';

export interface ItemType {
  id?: string;
  tokenId?: string;
  attachedTo: string | null;
  placeholder?: string;
  name: string | undefined | null;
  title?: string;
  description?: string;
  type: string;
}

export interface LemonType {
  id: string;
  owner: string;
  type: string;
  url: string;
  properties: ItemType[];
  items: ItemType[];
}

interface LemonState {
  lemons: LemonOwnedNftsResponse;
  inventoryIsOpened: boolean;
  activePlatform: number;
  wearingItem: ItemType | null;
  unwearingItem: ItemType | null;
}

const defaultResponse: LemonOwnedNftsResponse = {
  blockHash: '',
  ownedNfts: [],
  pageKey: undefined,
  totalCount: 0,
};

export const useLemonStore = create<LemonState>(() => ({
  lemons: defaultResponse,
  activePlatform: 1,
  inventoryIsOpened: false,
  wearingItem: null,
  unwearingItem: null,
}));
