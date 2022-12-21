import Head from 'next/head'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Loader from '../../components/Loader'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react';
import type {  SuiMoveObject } from "@mysten/sui.js";

export interface Loader {
  babylon: boolean
  data: boolean
}

const HubScene = dynamic(() => import('../../scenes/HubScene'), {
  suspense: true,
})

export default function Hub() {
  const [ loader, setLoader ] = useState<Loader>({ babylon: true, data: true });
  const [ lemons, setLemons ] = useState<SuiMoveObject[]>([]);

  useEffect(() => {
  }, [loader])

  const refreshLemons = async () => {
    let list: SuiMoveObject [] = [{"type":"0xd0b290b77ab543171422cffd7968d0ad749f29bf::lemon::Lemon","has_public_transfer":false,"fields":{"created":"45","id":{"id":"0xf7c4e107a8b299fdb116a852d66d8bcf908a7727"},"traits":[{"type":"0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>","fields":{"flavour":"Exo_Steel_Exoskeleton_AA01","name":"exo"}},{"type":"0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>","fields":{"flavour":"Eyes_Green_AA02","name":"eyes"}},{"type":"0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>","fields":{"flavour":"Head_Fresh_Lemon_AA01","name":"head"}},{"type":"0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>","fields":{"flavour":"Face_Visor_VR_VR01","name":"face"}},{"type":"0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>","fields":{"flavour":"Teeth_Hollywood_AA01","name":"teeth"}},{"type":"0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>","fields":{"flavour":"Back_Insecticide_Bottle_ZA01","name":"back"}},{"type":"0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>","fields":{"flavour":"Cap_Pirate_Bandana_PA02","name":"cap"}},{"type":"0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>","fields":{"flavour":"Cloth_Bandolier_MA02","name":"cloth"}},{"type":"0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>","fields":{"flavour":"FireArms_Sniper_Rifle_AA05","name":"weapon"}}],"url":"https://promo.battlemon.com/assets/default-lemon.png"}},{"type":"0xd0b290b77ab543171422cffd7968d0ad749f29bf::lemon::Lemon","has_public_transfer":false,"fields":{"created":"44","id":{"id":"0xda3d87f89fcac1701fd2873328a3be44955e5290"},"traits":[{"type":"0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>","fields":{"flavour":"Exo_Steel_Exoskeleton_AA01","name":"exo"}},{"type":"0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>","fields":{"flavour":"Eyes_Green_AA02","name":"eyes"}},{"type":"0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>","fields":{"flavour":"Head_Fresh_Lemon_AA01","name":"head"}},{"type":"0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>","fields":{"flavour":"Face_Sunglasses_RA01","name":"face"}},{"type":"0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>","fields":{"flavour":"Teeth_Hollywood_AA01","name":"teeth"}},{"type":"0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>","fields":{"flavour":"Back_Tactical_Backpack_MA01","name":"back"}},{"type":"0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>","fields":{"flavour":"Cap_Pirate_Bandana_PA02","name":"cap"}},{"type":"0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>","fields":{"flavour":"Cloth_Empty","name":"cloth"}},{"type":"0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>","fields":{"flavour":"FireArms_Handgun_SMG_AA04","name":"weapon"}}],"url":"https://promo.battlemon.com/assets/default-lemon.png"}},{"type":"0xd0b290b77ab543171422cffd7968d0ad749f29bf::lemon::Lemon","has_public_transfer":false,"fields":{"created":"43","id":{"id":"0xee071bbfb3ab5fa2698a9401b7596bc728f7f664"},"traits":[{"type":"0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>","fields":{"flavour":"Exo_Steel_Exoskeleton_AA01","name":"exo"}},{"type":"0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>","fields":{"flavour":"Eyes_Green_AA02","name":"eyes"}},{"type":"0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>","fields":{"flavour":"Head_Fresh_Lemon_AA01","name":"head"}},{"type":"0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>","fields":{"flavour":"Face_Visor_VR_VR01","name":"face"}},{"type":"0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>","fields":{"flavour":"Teeth_Hollywood_AA01","name":"teeth"}},{"type":"0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>","fields":{"flavour":"Back_Tactical_Backpack_MA01","name":"back"}},{"type":"0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>","fields":{"flavour":"Cap_Sheriff_Hat_CA02","name":"cap"}},{"type":"0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>","fields":{"flavour":"Cloth_Ninja_Waistband_NA01","name":"cloth"}},{"type":"0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>","fields":{"flavour":"ColdArms_Katana_NA01","name":"weapon"}}],"url":"https://promo.battlemon.com/assets/default-lemon.png"}}];

    setLemons(list);
    setLoader((loader) => ({ ...loader, data: false }));
  }

  useEffect(() => {
    refreshLemons();
  }, [])

  const handleMint = async () => {
    
  }


  return (
    <>
      <Head>
        <title>Battlemon GameFi Hub</title>
        <meta name="description" content="Battlemon - To the last drop of juice" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      { !loader.data && <HubScene lemons={lemons} setLoader={setLoader} handleMint={handleMint} /> }
      { (loader.babylon || loader.data) && <Loader status="connected" />}

    </>
  )
}
