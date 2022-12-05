import { atom } from 'recoil';
import type { SuiData } from "@mysten/sui.js";

export const loaderLemons = atom<SuiData[]>({
  key: 'loaderLemons',
  default: []
});