import useLinea from './useLinea';
import { useWaitForTransaction } from 'wagmi';
import { lineaNetwork } from '../helpers/linea';
import LEMONS_CONTRACT_SOL from '../helpers/abi/Lemons.json';
import { LEMONS_CONTRACT_ADDRESS, timeout } from '../helpers/linea';
import { useState } from 'react';
import type { LemonType } from '../helpers/lemonStore';

const useLemon = () => {
  const { address, publicClient, walletClient } = useLinea();
  const [mintSafeMintHash, setSafeMintHash] = useState<`0x${string}`>();

  const { isSuccess: successSafeMint } = useWaitForTransaction({
    hash: mintSafeMintHash,
  });

  if (!address || !walletClient) {
    return {};
  }

  const getURIs = async (gems: string[]) => {
    const promises = gems.map(async (gem: string) => {
      const metaURI = (await publicClient.readContract({
        address: LEMONS_CONTRACT_ADDRESS,
        abi: LEMONS_CONTRACT_SOL.abi,
        functionName: 'tokenURI',
        args: [gem],
      })) as string;
      return metaURI;
    });
  
    return await Promise.all(promises);
  }

  const safeMint = async () => {
    try {
      const { request } = await publicClient.simulateContract({
        account: address,
        address: LEMONS_CONTRACT_ADDRESS,
        abi: LEMONS_CONTRACT_SOL.abi,
        chain: lineaNetwork,
        functionName: 'safeMint',
        gas: 200_000n,
        args: [address]
      });
      const hash = await walletClient?.writeContract(request);
      if (hash) setSafeMintHash(hash);
    } catch (e) {
      const { message } = e as Error;
      console.log(message);
    }
  };

  const getLemonList = async (): Promise<LemonType[] | undefined> => {
    if (!address) return;
    await timeout(2000);
    const fetched = await fetch(`/api/linea/lemons?address=${address}`)

    const {
      result: {
        data: { user },
      },
    } = await fetched.json();

    return user?.tokens || [];
  };

  return {
    safeMint,
    successSafeMint,
    getLemonList
  };
};

export default useLemon;
