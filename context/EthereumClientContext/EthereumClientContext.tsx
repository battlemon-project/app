import { type EthereumClient } from '@web3modal/ethereum';
import { createContext } from 'react';

export interface ValueType {
  ethereumClient: EthereumClient | null;
}
export const EthereumClientContext = createContext<ValueType>({
  ethereumClient: null,
});

export const EthereumClientProvider = EthereumClientContext.Provider;
