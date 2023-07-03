import { create } from 'zustand';

interface ChestState {
  openA?: () => void;
  openB?: () => void;
  openC?: () => void;
  openAStart?: () => void;
  openBStart?: () => void;
  openCStart?: () => void;
}

export const useChests = create<ChestState>((set) => ({}));
