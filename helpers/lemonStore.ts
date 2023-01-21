import { createStore } from 'zustand/vanilla'
import { OutfitType } from './dummyLemon'
import type { SuiMoveObject } from "@mysten/sui.js";

type LemonState = {
  lemons: SuiMoveObject[];
  inventoryIsOpened: boolean;
  activePlatform: number;
  changeOutfit: OutfitType | null;
}

export const lemonStore = createStore<LemonState>(() => ({
  lemons: [],
  activePlatform: 1,
  inventoryIsOpened: false,
  changeOutfit: null
}))
