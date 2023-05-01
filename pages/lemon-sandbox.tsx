import LemonSandboxScene from '../scenes/LemonSandboxScene'
import { useLemonStore } from "../helpers/lemonStore";
import { dummyLemon } from '../helpers/dummyLemon';
import { useEffect } from 'react';
import { NftTokenType } from 'alchemy-sdk';

const LemonSandbox = () => {
  const { lemons  } = useLemonStore(({ lemons }) => ({ lemons }))

  useEffect(() => {
    const dummy = dummyLemon()
    lemons.ownedNfts = [{
      tokenId: "1",
      tokenType: NftTokenType.ERC721,
      balance: 0,
      contract: { tokenType: NftTokenType.ERC721, address: "0xeae26aa7aD3E54C208a22a78bd9E5d2D7ccFC18D" },
      title: "",
      description: "",
      timeLastUpdated: "",
      metadataError:  undefined,
      tokenUri: undefined,
      media: [],
      rawMetadata: {
        properties: dummy.properties,
        items: dummy.items
      }
    }]
    
    useLemonStore.setState({ lemons: lemons });
  }, [])

  return (<>
    {lemons.ownedNfts?.length && <LemonSandboxScene />}
  </>)
}

export default LemonSandbox;