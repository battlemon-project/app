import useLinea from './useLinea';
import { useWaitForTransaction } from 'wagmi';
import { lineaTestnet } from 'wagmi/chains';
import GEMS_CONTRACT_SOL from '../helpers/abi/Gem.json';
import { GEMS_CONTRACT_ADDRESS } from '../helpers/linea';
import { parseEther } from 'viem';
import { useState } from 'react';

export interface INft {
  id: string;
  image: string;
  tokenId: string;
  meta: number;
}

const useGem = () => {
  const { address, publicClient, walletClient } = useLinea();
  const [mintMergeGemHash, setMergeGemHash] = useState<`0x${string}`>();

  const { isSuccess: successMergeGem } = useWaitForTransaction({
    hash: mintMergeGemHash,
  });

  if (!address || !walletClient) {
    return {};
  }

  const mergeGem = async (gem1: string, gem2: string) => {
    try {
      const { request } = await publicClient.simulateContract({
        address: GEMS_CONTRACT_ADDRESS,
        abi: GEMS_CONTRACT_SOL.abi,
        chain: lineaTestnet,
        functionName: 'merge',
        args: [gem1, gem2],
        value: parseEther('0.0005'),
      });
      const hash = await walletClient?.writeContract(request);
      if (hash) setMergeGemHash(hash);
    } catch (e) {
      const { message } = e as Error;
      console.log(message);
    }
  };

  const getGemList = async () => {
    if (!address) return;
    const data = await fetch(`/api/linea/gems?address=${address}`);
    const {
      result: {
        data: { token721S: gems },
      },
    } = await data.json();

    const promises = gems.map(async (gem: INft) => {
      if (!gem.tokenId) {
        gem.image = '0.png';
        return gem;
      }
      const metaURI = (await publicClient.readContract({
        address: GEMS_CONTRACT_ADDRESS,
        abi: GEMS_CONTRACT_SOL.abi,
        functionName: 'tokenURI',
        args: [gem.tokenId],
      })) as string;
      gem.meta = parseInt(metaURI.split('/').at(-1) as string);
      gem.image = gem.meta + '.png';
      return gem;
    });

    await Promise.all(promises);
    return gems;
  };

  return {
    mergeGem,
    successMergeGem,
    getGemList,
  };
};

export default useGem;
