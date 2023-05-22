import { type ItemType } from '../helpers/lemonStore';

export interface TraitType {
  id?: string;
  attachedTo: string | null;
  type: string;
  flavour: string;
}

export interface NftType {
  id: string;
  owner: string;
  type: string;
  url: string;
  traits: TraitType[];
  items?: NftType[];
  attachedTo?: string;
}

export interface GraphqlResultType {
  data: {
    nfts: NftType[];
  };
  error?: any;
}

export async function getItems(address: string): Promise<ItemType[]> {
  const items: ItemType[] = [];

  return items;
}
