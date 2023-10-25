import { create } from 'zustand';

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
  tokenId: string;
  owner: string;
  image: string;
  type: string;
  url: string;
  properties: ItemType[];
  items: ItemType[];
}

interface LemonState {
  lemon: LemonType | null;
  inventoryIsOpened: boolean;
  wearingItem: ItemType | null;
  unwearingItem: ItemType | null;
}

export const useLemonStore = create<LemonState>(() => ({
  lemon: null,
  inventoryIsOpened: false,
  wearingItem: null,
  unwearingItem: null,
}));
