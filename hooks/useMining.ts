import useLinea from './useLinea';
import { useWaitForTransaction } from 'wagmi';
import { lineaTestnet } from 'wagmi/chains';
import PICK_AXE_CONTRACT_SOL from '../helpers/abi/PickAxe.json';
import { PICK_AXE_CONTRACT_ADDRESS } from '../helpers/linea';
import { parseEther } from 'viem';
import { useState } from 'react';
import { StaticImageData } from 'next/image';
import { create } from 'zustand';

export interface INft {
  id: string;
  image: StaticImageData;
  tokenId: string;
  meta: number;
}

import Pick1 from '../public/resources/assets/256/IcePick-1.png';
import Pick2 from '../public/resources/assets/256/IcePick-2.png';
import Pick3 from '../public/resources/assets/256/IcePick-3.png';

const pickAxeImages: Record<number, StaticImageData> = {
  0: Pick1,
  1: Pick2,
  2: Pick3,
};

const useFreeGem = () => {
  const { address, publicClient, walletClient } = useLinea();
  const [chipOffHashHash, setChipOffHash] = useState<`0x${string}`>();
  const [sharpHash, setSharpHash] = useState<`0x${string}`>();

  const { isSuccess: successChipOff } = useWaitForTransaction({
    hash: chipOffHashHash,
  });
  const { isSuccess: successSharp } = useWaitForTransaction({
    hash: sharpHash,
  });

  if (!address || !walletClient) {
    return {};
  }

  const chipOff = async (tokenId: string) => {
    console.log(tokenId);
    try {
      const { request } = await publicClient.simulateContract({
        account: address,
        address: PICK_AXE_CONTRACT_ADDRESS,
        abi: PICK_AXE_CONTRACT_SOL.abi,
        chain: lineaTestnet,
        functionName: 'chipOff',
        args: [tokenId],
      });
      const hash = await walletClient?.writeContract(request);
      if (hash) setChipOffHash(hash);
    } catch (e) {
      const { message } = e as Error;
      console.log(message);
    }
  };

  const sharp = async (pickAxe: INft) => {
    try {
      const { request } = await publicClient.simulateContract({
        address: PICK_AXE_CONTRACT_ADDRESS,
        abi: PICK_AXE_CONTRACT_SOL.abi,
        chain: lineaTestnet,
        functionName: 'sharp',
        args: [pickAxe.tokenId],
        value: parseEther(['0.0001', '0.00016', '0.00022'][pickAxe.meta]),
      });
      const hash = await walletClient?.writeContract(request);
      if (hash) setSharpHash(hash);
    } catch (e) {
      const { message } = e as Error;
      console.log(message);
    }
  };

  const getSharpnessOf = async (tokenId: string): Promise<number> => {
    let sharpness = 100;
    try {
      sharpness = (await publicClient.readContract({
        address: PICK_AXE_CONTRACT_ADDRESS,
        abi: PICK_AXE_CONTRACT_SOL.abi,
        functionName: 'sharpnessOf',
        args: [tokenId],
      })) as number;
    } catch (e) {
      const { message } = e as Error;
      console.log(message);
    }
    return sharpness;
  };

  const getPickAxesList = async () => {
    if (!address) return;
    const data = await fetch(`/api/linea/pickaxes?address=${address}`);
    const {
      result: {
        data: { token721S: pickaxes },
      },
    } = await data.json();

    const promises = pickaxes.map(async (pickAxe: INft) => {
      if (!pickAxe.tokenId) {
        pickAxe.image = pickAxeImages[0];
        return pickAxe;
      }
      const metaURI = (await publicClient.readContract({
        address: PICK_AXE_CONTRACT_ADDRESS,
        abi: PICK_AXE_CONTRACT_SOL.abi,
        functionName: 'tokenURI',
        args: [pickAxe.tokenId],
      })) as string;
      pickAxe.meta = parseInt(metaURI.split('/').at(-1) as string);
      pickAxe.image = pickAxeImages[pickAxe.meta];
      return pickAxe;
    });

    await Promise.all(promises);
    return pickaxes;
  };

  return {
    chipOff,
    successChipOff,
    sharp,
    successSharp,
    getSharpnessOf,
    getPickAxesList,
  };
};

interface MiningStoreProp {
  startMining?: (rank: number) => void;
  showPickAxe?: (rank: number) => void;
  startGemAppear?: (rank: number) => void;
}

export const useMiningStore = create<MiningStoreProp>((set) => ({}));

export default useFreeGem;
