import useLinea from './useLinea';
import { useWaitForTransaction } from 'wagmi';
import { lineaTestnet } from 'wagmi/chains';
import FREE_GEMS_CONTRACT_SOL from '../helpers/abi/FreeGem.json';
import { FREE_GEMS_CONTRACT_ADDRESS } from '../helpers/linea';
import { parseEther } from 'viem';
import { useState } from 'react';

export interface INft {
  id: string;
  image: string;
  tokenId: string;
  meta: number;
}

const gemImages: Record<number, string> = {
  0: 'BTLN_Gem_Green_A_128.png',
  1: 'BTLN_Gem_Blue_A_128.png',
  2: 'BTLN_Gem_Yellow_A_128.png',
  3: 'BTLN_Gem_Purple_A_128.png',
  4: 'BTLN_Gem_Orange_A_128.png',
  5: 'BTLN_Gem_Red_A_128.png',
  6: 'BTLN_Gem_Sky_A_128.png',
};

const useFreeGem = () => {
  const { address, publicClient, walletClient } = useLinea();
  const [mintFreeGemHash, setMintFreeGemHash] = useState<`0x${string}`>();
  const [mintMergeGemHash, setMergeFreeGemHash] = useState<`0x${string}`>();

  const { isSuccess: successMintFreeGem } = useWaitForTransaction({
    hash: mintFreeGemHash,
  });
  const { isSuccess: successMergeFreeGem } = useWaitForTransaction({
    hash: mintMergeGemHash,
  });

  if (!address || !walletClient) {
    return {};
  }

  const mintFreeGem = async () => {
    try {
      const { request } = await publicClient.simulateContract({
        address: FREE_GEMS_CONTRACT_ADDRESS,
        abi: FREE_GEMS_CONTRACT_SOL.abi,
        chain: lineaTestnet,
        functionName: 'mint',
        args: [address, 1],
      });
      const hash = await walletClient?.writeContract(request);
      if (hash) setMintFreeGemHash(hash);
    } catch (e) {
      const { message } = e as Error;
      console.log(message);
    }
  };

  const mergeFreeGem = async (gem1: string, gem2: string) => {
    try {
      const { request } = await publicClient.simulateContract({
        address: FREE_GEMS_CONTRACT_ADDRESS,
        abi: FREE_GEMS_CONTRACT_SOL.abi,
        chain: lineaTestnet,
        functionName: 'merge',
        args: [gem1, gem2],
        value: parseEther('0.0005'),
      });
      const hash = await walletClient?.writeContract(request);
      if (hash) setMergeFreeGemHash(hash);
    } catch (e) {
      const { message } = e as Error;
      console.log(message);
    }
  };

  const getFreeGemList = async () => {
    if (!address) return;
    const data = await fetch(`/api/linea/gems?address=${address}`);
    const {
      result: {
        data: { token721S: gems },
      },
    } = await data.json();

    const promises = gems.map(async (gem: INft) => {
      if (!gem.tokenId) {
        gem.image = gemImages[0];
        return gem;
      }
      const metaURI = (await publicClient.readContract({
        address: FREE_GEMS_CONTRACT_ADDRESS,
        abi: FREE_GEMS_CONTRACT_SOL.abi,
        functionName: 'tokenURI',
        args: [gem.tokenId],
      })) as string;
      gem.meta = parseInt(metaURI.split('/').at(-1) as string);
      gem.image = gemImages[gem.meta];
      return gem;
    });

    await Promise.all(promises);
    return gems;
  };

  return {
    mintFreeGem,
    successMintFreeGem,
    mergeFreeGem,
    successMergeFreeGem,
    getFreeGemList,
  };
};

export default useFreeGem;
