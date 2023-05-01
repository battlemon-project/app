import { LemonType, ItemType } from '../helpers/lemonStore'

export type TraitType = {
  id?: string
  attachedTo: string | null
  type: string
  flavour: string
}

export type NftType = {
  id: string
  owner: string
  type: string
  url: string
  traits: TraitType[]
  items?: NftType[]
  attachedTo?: string
}

export type GraphqlResultType = {
  data: {
    nfts: NftType[]
  }
  error?: any
}

// export async function getLemons(address: string): Promise<LemonType[]> {
//   const query = `
//     query {
//       nfts(type: "lemon", owner: "${address}") {
//         id,
//         type,
//         owner,
//         url,
//         traits {
//           type: name,
//           flavour
//         },
//         items {
//           id,
//           type,
//           owner,
//           url,
//           traits {
//             type: name 
//             flavour
//           }
//         }  
//       }
//     }
//   `

//   const response = await fetch('/api/graphql', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(query)
//   });

//   const result: GraphqlResultType = await response.json()
//   const { data: { nfts }} = result;

//   const lemons: LemonType[] = []

//   nfts.forEach(nft => {
//     const { id, owner, type, url, traits, items } = nft
//     const lemonItems: []
//     // ItemType[] = (items || []).map((nft) => {
//     //   const item = nft.traits[0];
//     //   item.id = nft.id;
//     //   return item;
//     // })


//     lemons.push({
//       id, owner, type, url, properties: traits, items: lemonItems
//     })
//   })

//   return lemons;
// }

export async function getItems(address: string): Promise<ItemType[]> {
  const query = `
    query {
      nfts(type: "item", owner: "${address}") {
        id,
        type,
        owner,
        url,
        attachedTo,
        traits {
          type: name,
          flavour
        }
      }
    }
  `

  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query)
  });

  const result: GraphqlResultType = await response.json()
  const { data: { nfts } } = result;

  const items: ItemType[] = [];
  // nfts.map((nft) => {
  //   const item = nft.traits[0];
  //   item.attachedTo = nft.attachedTo || null
  //   item.id = nft.id;
  //   return item;
  // })

  return items;
}
