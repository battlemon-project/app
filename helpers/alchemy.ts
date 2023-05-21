import type { NftMetadata, OwnedNft, OwnedNftsResponse } from 'alchemy-sdk';
import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { type ItemType } from './lemonStore';
import Lemon_SOL from './contracts/Lemon.sol/Lemon.json';
import Cap_SOL from './contracts/Cap.sol/Cap.json';
import Glasses_SOL from './contracts/Glasses.sol/Glasses.json';
import Back_SOL from './contracts/Back.sol/Back.json';
import ColdArms_SOL from './contracts/ColdArms.sol/ColdArms.json';
import FireArms_SOL from './contracts/FireArms.sol/FireArms.json';
import Belt_SOL from './contracts/Belt.sol/Belt.json';
import Shoes_SOL from './contracts/Shoes.sol/Shoes.json';
import Gem_SOL from './contracts/Gem.sol/Gem.json';
import { BigNumber } from 'ethers';

const Lemons: `0x${string}` = '0xeae26aa7aD3E54C208a22a78bd9E5d2D7ccFC18D';
const LemonsColdArms: `0x${string}` =
  '0x77d2Ae81dF753A49481Bcbffcf95646Be792c9D7';
const LemonsFireArms: `0x${string}` =
  '0x65d3c393E7958a86aAC74675C01e11D408a42A6f';
const LemonsCap: `0x${string}` = '0x507ee691A6686f25E864303f77b7AB606B40Cd1D';
const LemonsBack: `0x${string}` = '0x833dd7c42A7aC9ADDB18cdDEf8B8b127Ca5b3b6b';
const LemonsGlasses: `0x${string}` =
  '0x0858DDc9E69a1040b9201C3aa43242FB94E88042';
const LemonsBelt: `0x${string}` = '0x6351414109528ADaB871d4496Fe5a35c4dD207b7';
const LemonsShoes: `0x${string}` = '0xA1E82098eaeB0722Ea3e8751A1eFDC0F8cec3bA5';
export const GEM_CONTRACT: `0x${string}` =
  '0x37ae2EE40E883185870E90F3e1483cE743c27221';

const alchemyConfig = {
  apiKey: 't98BM1vZ3jmENv6alKMurcwObFAjMn1g',
  network: Network.ETH_SEPOLIA,
};

const alchemy = new Alchemy(alchemyConfig);

export default alchemy;

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
  const result = (await alchemy.nft.getNftsForOwner(address, {
    contractAddresses: [Lemons],
  })) as LemonOwnedNftsResponse;
  result.ownedNfts.reverse().forEach((nft) => {
    nft.rawMetadata.items = [];
  });
  return result;
}

export async function getItems(
  address: string
): Promise<ItemOwnedNftsResponse> {
  return (await alchemy.nft.getNftsForOwner(Lemons, {
    contractAddresses: [
      LemonsCap,
      LemonsBack,
      LemonsGlasses,
      LemonsColdArms,
      LemonsFireArms,
      LemonsBelt,
      LemonsShoes,
    ],
  })) as ItemOwnedNftsResponse;
}

export async function getGems(address: string): Promise<OwnedNftsResponse> {
  const result = await alchemy.nft.getNftsForOwner(address, {
    contractAddresses: [GEM_CONTRACT],
  });
  return result;
}

export const mintLemonData = (address: `0x${string}` | undefined) => ({
  address: Lemons,
  abi: Lemon_SOL.abi,
  functionName: 'mint',
  args: [address, 1],
  overrides: {
    value: BigNumber.from(1000000000),
    // gasLimit: BigNumber.from(10000000)
  },
});

export const mintItemData = (
  address: `0x${string}` | undefined,
  length: number | undefined
) => {
  const mint = {
    functionName: 'mint',
    args: [1],
  };

  if (!length || length % 7 == 0) {
    return { address: LemonsCap, abi: Cap_SOL.abi, ...mint };
  } else if (length % 7 == 1) {
    return { address: LemonsBack, abi: Back_SOL.abi, ...mint };
  } else if (length % 7 == 2) {
    return { address: LemonsGlasses, abi: Glasses_SOL.abi, ...mint };
  } else if (length % 7 == 3) {
    return { address: LemonsColdArms, abi: ColdArms_SOL.abi, ...mint };
  } else if (length % 7 == 4) {
    return { address: LemonsFireArms, abi: FireArms_SOL.abi, ...mint };
  } else if (length % 7 == 5) {
    return { address: LemonsBelt, abi: Belt_SOL.abi, ...mint };
  } else if (length % 7 == 6) {
    return { address: LemonsShoes, abi: Shoes_SOL.abi, ...mint };
  }
};

export const mintGem = (address: `0x${string}` | undefined) => ({
  address: GEM_CONTRACT,
  abi: Gem_SOL.abi,
  functionName: 'mint',
  args: [address, 1],
});

export const craftGems = (id1: string | null, id2: string | null) => {
  id1 = id1 ?? '1';
  id2 = id2 ?? '2';
  return {
    address: GEM_CONTRACT,
    abi: Gem_SOL.abi,
    functionName: 'merge',
    args: [id1, id2],
    overrides: {
      value: Utils.parseEther('0.01'),
    },
  };
};
