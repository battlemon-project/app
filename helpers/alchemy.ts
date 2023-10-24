import type { NftMetadata, OwnedNft, OwnedNftsResponse } from 'alchemy-sdk';
import type { ItemType } from './lemonStore';
import { LEMONS_CONTRACT_ADDRESS, ITEMS_CONTRACT_ADDRESS } from './linea';
import LEMONS_CONTRACT_SOL from './abi/Lemons.json';
import ITEMS_CONTRACT_SOL from './abi/Items.json';
import { parseEther } from 'viem';

interface LemonNftMetadata extends NftMetadata {
  properties: ItemType[];
  items: ItemType[];
}

interface ItemNftMetadata extends NftMetadata {
  properties: ItemType;
}

export interface LemonOwnedNft extends OwnedNft {
  rawMetadata: LemonNftMetadata;
}

export interface ItemOwnedNft extends OwnedNft {
  rawMetadata: ItemNftMetadata;
}

export interface LemonOwnedNftsResponse extends OwnedNftsResponse {
  ownedNfts: LemonOwnedNft[];
}

export interface ItemOwnedNftsResponse extends OwnedNftsResponse {
  ownedNfts: ItemOwnedNft[];
}

export async function getLemons(
  address: string
): Promise<LemonOwnedNftsResponse> {
  return {
    ownedNfts: [],
    totalCount: 0,
    blockHash: 'dummy data: ' + address
  };
}

export async function getItems(
  address: string
): Promise<ItemOwnedNftsResponse> {
  return {
    ownedNfts: [],
    totalCount: 0,
    blockHash: 'dummy data: ' + address
  };
}

export async function getGems(address: string): Promise<OwnedNftsResponse> {
  return {
    ownedNfts: [],
    totalCount: 0,
    blockHash: 'dummy data'
  };
}

export const mintLemonData = (address: `0x${string}` | undefined) => ({
  address: LEMONS_CONTRACT_ADDRESS,
  abi: LEMONS_CONTRACT_SOL.abi,
  functionName: 'safeMint',
  args: [address]
});

export const mintItemData = (
  address: `0x${string}` | undefined
) => ({
  address: ITEMS_CONTRACT_ADDRESS,
  abi: ITEMS_CONTRACT_SOL.abi,
  functionName: 'mintRandom',
  args: [address, 1]
});
