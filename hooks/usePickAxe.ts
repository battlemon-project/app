import useLinea from './useLinea';
import { useWaitForTransaction } from 'wagmi';
import { lineaTestnet } from 'wagmi/chains';
import { PICK_AXE_CONTRACT_ADDRESS } from '../helpers/linea';
import PICK_AXE_CONTRACT_SOL from '../helpers/abi/PickAxe.json';
import { parseEther } from 'viem';
import { useState } from 'react';

const usePickAxe = () => {
  const { address, publicClient, walletClient } = useLinea();
  const [mintPickAxeHash, setMintPickAxeHash] = useState<`0x${string}`>();

  const { isSuccess: successMintPickAxe } = useWaitForTransaction({
    hash: mintPickAxeHash,
  });

  if (!address || !walletClient) {
    return {};
  }

  const mintPickAxe = async () => {
    try {
      const { request } = await publicClient.simulateContract({
        address: PICK_AXE_CONTRACT_ADDRESS,
        abi: PICK_AXE_CONTRACT_SOL.abi,
        chain: lineaTestnet,
        functionName: 'mint',
        args: [address],
        value: parseEther('0.01'),
      });
      const hash = await walletClient?.writeContract(request);
      if (hash) setMintPickAxeHash(hash);
    } catch (e) {
      const { message } = e as Error;
      console.log(message);
    }
  };

  return { authorized: true, mintPickAxe, successMintPickAxe };
};

export default usePickAxe;
