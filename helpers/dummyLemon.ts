export const outfits = {
  back: [
    'Back_Insecticide_Bottle_ZA01',
    'Back_Bomb_Barrel_PA02',
    'Back_Tactical_Backpack_MA01',
    'Back_Adventurer_Backpack_PA01'
  ],
  cap: [
    'Cap_Baseball_Cap_Red_RA01',
    'Cap_Ladle_ZA01',
    'Cap_Cheef_Hat_KA01',
    'Cap_Cone_Armored_Hat_NA03',
    'Cap_Cowboy_Hat_CA01',
    'Cap_Sheriff_Hat_CA02',
    'Cap_Military_Cap_MA05',
    'Cap_Special_Forces_Beret_MA02',
    'Cap_Tank_Helmet_MA03',
    'Cap_Military_Helmet_MA04',
    'Cap_Metallic_Cone_Hat_NA04',
    'Cap_Assault_Helmet_MA01',
    'Cap_Cane_Cone_Hat_NA02',
    'Cap_Cocked_Hat_PA01',
    'Cap_Pirate_Bandana_PA02'
  ],
  cloth: [
    'Cloth_Chain_Gold_RA01',
    'Cloth_Cheef_Sash_KA01',
    'Cloth_Eastern_Armor_Belt_NA02',
    'Cloth_Ninja_Waistband_NA01',
    'Cloth_Poncho_CA01',
    'Cloth_Bandolier_MA02',
    'Cloth_Skull_Belt_PA01'   
  ],
  cold_arms: [
    'ColdArms_Bottle_Rose_RA01',
    'ColdArms_Grappling_Hook_PA01',
    'ColdArms_Chopper_Knife_KA01',
    'ColdArms_Katana_NA01',
  ],
  face: [
    'Face_Sunglasses_RA01',
    'Face_Visor_VR_VR01',
    'Face_Cowboy_Scarf_CA01',
    'Empty'
  ],
  fire_arms: [
    'FireArms_Revolver_CA01',
    'FireArms_Grenade_Launcher_AA03',
    'FireArms_Handgun_SMG_AA04',
    'FireArms_Assault_Rifle_AA01',
    'FireArms_Assault_Rifle_AA02',
    'FireArms_Sniper_Rifle_AA05'
  ],
  teeth: [
    'Teeth_Grga_AA02',
    'Teeth_Hollywood_AA01',
    'Teeth_Oldstyle_AA04',
    'Teeth_Sharp_AA03',
    'Teeth_Grillz_Silver_RA01'   
  ],
  eyes: [
    'Eyes_Blue_AA01',
    'Eyes_Green_AA02',
    'Eyes_Zombie_ZA01'
  ],
  exo: [
    'Exo_Snowwhite_Exoskeleton_AA02',
    'Exo_Steel_Exoskeleton_AA01',
    'Exo_Military_Exoskeleton_MA01'   
  ],
  head: [
    'Head_Fresh_Lemon_AA01',
    'Head_Zombie_ZA01',
    'Head_Clementine_AA02',
    'Head_Lime_AA03'
  ],
  shoes: [
    'Shoes_Kicks_SA01',
    'Shoes_Armored_Shoes_AA01',
    'Shoes_Military_Shoes_MA01',
    'Shoes_Kicks_SA02'
  ]
}

function random(array: string[]): string {
  return array[Math.floor(Math.random()*array.length)];
}

export const dummyLemon = () => {
  const lemon = {
    type: "0xd0b290b77ab543171422cffd7968d0ad749f29bf::lemon::Lemon",
    has_public_transfer: false,
    fields: {
      created: "45",
      id: {
        id: "0xf7c4e107a8b299fdb116a852d66d8bcf908a7727"
      },
      traits: [
        {
          type: "0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>",
          fields: {
            flavour: random(outfits.exo),
            name: "exo"
          }
        },
        {
          type: "0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>",
          fields: {
            flavour: random(outfits.eyes),
            name: "eyes"
          }
        },
        {
          type: "0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>",
          fields: {
            flavour: random(outfits.head),
            name: "head"
          }
        },
        {
          type: "0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>",
          fields: {
            flavour: random(outfits.face),
            name: "face"
          }
        },
        {
          type: "0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>",
          fields: {
            flavour: random(outfits.teeth),
            name: "teeth"
          }
        },
        {
          type: "0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>",
          fields: {
            flavour: random(outfits.back),
            name: "back"
          }
        },
        {
          type: "0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>",
          fields: {
            flavour: random(outfits.cap),
            name: "cap"
          }
        },
        {
          type: "0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>",
          fields: {
            flavour: random(outfits.cloth),
            name: "cloth"
          }
        },
        {
          type: "0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>",
          fields: {
            flavour: random([...outfits.cold_arms, ...outfits.fire_arms]),
            name: "weapon"
          }
        },
        {
          type: "0xd0b290b77ab543171422cffd7968d0ad749f22ff::trait::Trait<0x1::string::String, 0x1::string::String>",
          fields: {
            flavour: random(outfits.shoes),
            name: "shoes"
          }
        }        
      ],
      url: "https://promo.battlemon.com/assets/default-lemon.png"
    }
  }

  return lemon;
}