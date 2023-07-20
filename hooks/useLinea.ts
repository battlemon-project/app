import {
  useAccount,
  useNetwork,
  useSwitchNetwork,
  usePublicClient,
  useWalletClient,
} from 'wagmi';
import { lineaNetwork } from '../helpers/linea';

const useLinea = () => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient({ chainId: lineaNetwork.id });
  const publicClient = usePublicClient({ chainId: lineaNetwork.id });
  const { switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();

  if (chain?.id !== lineaNetwork.id) {
    switchNetwork?.(lineaNetwork.id);
    return { publicClient };
  }

  if (!address || !walletClient) {
    return { publicClient };
  }

  return { address, publicClient, walletClient };
};

export default useLinea;
