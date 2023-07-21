import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { lineaNetwork } from '../helpers/linea';

const useLinea = () => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient({ chainId: lineaNetwork.id });
  const publicClient = usePublicClient({ chainId: lineaNetwork.id });

  if (!address || !walletClient) {
    return { publicClient };
  }

  return { address, publicClient, walletClient };
};

export default useLinea;
