
import { WalletContextState } from '@suiet/wallet-kit';

const lemon_contract="0x5bfb318d0b969e2cc2d636fb648f22d7bc33bdf2"
const lemon_registry="0x5de755a2f53c1c2a805de83a01e4b62a1414fcdf"
const item_registry="0x86880eeb9470093d47c6d33e6a090e11655470d6"

export async function mintLemon(wallet: WalletContextState) {
  if (!wallet) return;

  const signableTransaction = {
    kind: 'moveCall' as const,
    data: {
      packageObjectId: lemon_contract,
      module: 'lemon',
      function: 'create_lemon',
      typeArguments: [],
      arguments: [
        lemon_registry,
      ],

      
      gasBudget: 10000,
    },
  }

  // await wallet.signAndExecuteTransaction({
  //   transaction: signableTransaction 
  // });
}

export async function mintItem(wallet: WalletContextState) {
  if (!wallet) return;

  const signableTransaction = {
    kind: 'moveCall' as const,
    data: {
      packageObjectId: lemon_contract,
      module: 'item',
      function: 'create_item',
      typeArguments: [],
      arguments: [
        item_registry,
      ],
      gasBudget: 10000,
    },
  }

  // await wallet.signAndExecuteTransaction({
  //   transaction: signableTransaction 
  // });
}

export async function confirmAddItem(wallet: WalletContextState, lemonId: string, itemId: string) {
  if (!wallet) return;

  const signableTransaction = {
    kind: 'moveCall' as const,
    data: {
      packageObjectId: lemon_contract,
      module: 'lemon',
      function: 'add_item',
      typeArguments: [],
      arguments: [
        lemonId, itemId
      ],
      gasBudget: 10000,
    },
  }

  // await wallet.signAndExecuteTransaction({
  //   transaction: signableTransaction 
  // });
}

export async function confirmTakeoffItem(wallet: WalletContextState, lemonId: string, itemType: string) {
  if (!wallet) return;

  const signableTransaction = {
    kind: 'moveCall' as const,
    data: {
      packageObjectId: lemon_contract,
      module: 'lemon',
      function: 'remove_item',
      typeArguments: [],
      arguments: [
        lemonId, itemType
      ],
      gasBudget: 10000,
    },
  }

  // await wallet.signAndExecuteTransaction({
  //   transaction: signableTransaction 
  // });
}
