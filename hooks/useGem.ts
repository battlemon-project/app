import useLinea from './useLinea';
import { useWaitForTransaction } from 'wagmi';
import { lineaTestnet } from 'wagmi/chains';
import GEMS_CONTRACT_SOL from '../helpers/abi/Gem.json';
import { GEMS_CONTRACT_ADDRESS, timeout } from '../helpers/linea';
import { parseEther } from 'viem';
import { useState } from 'react';

export interface INft {
  id: string;
  image: string;
  tokenId: string;
  rank: number;
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

  const mergeGem = async (gem1: string, gem2: string, price: number) => {
    try {
      const { request } = await publicClient.simulateContract({
        account: address,
        address: GEMS_CONTRACT_ADDRESS,
        abi: GEMS_CONTRACT_SOL.abi,
        chain: lineaTestnet,
        functionName: 'merge',
        args: [gem1, gem2],
        value: parseEther(price.toString()),
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
    await timeout(2000);
    const data = await fetch(`/api/linea/gems?address=${address}`);
    
    const {
      result: {
        data: {
          user,
        },
      },
    } = await data.json();

    const gems = user?.tokens || [];

    gems.map((gem: INft) => {
      gem.image = gem.rank + '.png';
      return gem;
    });

    return gems;
  };

  return {
    mergeGem,
    successMergeGem,
    getGemList,
  };
};

export default useGem;
