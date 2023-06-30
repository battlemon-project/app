import {
  useAccount,
  useNetwork,
  useSwitchNetwork,
  usePublicClient,
  useWalletClient,
} from 'wagmi';
import { lineaTestnet } from 'wagmi/chains';

const useLinea = () => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient({ chainId: lineaTestnet.id });
  const publicClient = usePublicClient({ chainId: lineaTestnet.id });
  const { switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();

  if (chain?.id !== lineaTestnet.id) {
    switchNetwork?.(lineaTestnet.id);
    return { publicClient };
  }

  if (!address || !walletClient) {
    return { publicClient };
  }

  return { address, publicClient, walletClient };
};

export default useLinea;
