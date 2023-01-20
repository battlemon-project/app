export type OutfitType = { 
  name: string, 
  type: string 
}

export type OutfitListType = {
  [key: string]: OutfitType[]
}

export const outfits: OutfitListType = {
  back: [
    { name: 'Back_Insecticide_Bottle_ZA01', type: 'back' },
    { name: 'Back_Bomb_Barrel_PA02', type: 'back' },
    { name: 'Back_Tactical_Backpack_MA01', type: 'back' },
    { name: 'Back_Adventurer_Backpack_PA01', type: 'back' }
  ],
  cap: [
    { name: 'Cap_Baseball_Cap_Red_RA01', type: 'cap' },
    { name: 'Cap_Ladle_ZA01', type: 'cap' },
    { name: 'Cap_Cheef_Hat_KA01', type: 'cap' },
    { name: 'Cap_Cone_Armored_Hat_NA03', type: 'cap' },
    { name: 'Cap_Cowboy_Hat_CA01', type: 'cap' },
    { name: 'Cap_Sheriff_Hat_CA02', type: 'cap' },
    { name: 'Cap_Military_Cap_MA05', type: 'cap' },
    { name: 'Cap_Special_Forces_Beret_MA02', type: 'cap' },
    { name: 'Cap_Tank_Helmet_MA03', type: 'cap' },
    { name: 'Cap_Military_Helmet_MA04', type: 'cap' },
    { name: 'Cap_Metallic_Cone_Hat_NA04', type: 'cap' },
    { name: 'Cap_Assault_Helmet_MA01', type: 'cap' },
    { name: 'Cap_Cane_Cone_Hat_NA02', type: 'cap' },
    { name: 'Cap_Cocked_Hat_PA01', type: 'cap' },
    { name: 'Cap_Pirate_Bandana_PA02', type: 'cap' }
  ],
  cloth: [
    { name: 'Cloth_Chain_Gold_RA01', type: 'cloth' },
    { name: 'Cloth_Cheef_Sash_KA01', type: 'cloth' },
    { name: 'Cloth_Eastern_Armor_Belt_NA02', type: 'cloth' },
    { name: 'Cloth_Ninja_Waistband_NA01', type: 'cloth' },
    { name: 'Cloth_Poncho_CA01', type: 'cloth' },
    { name: 'Cloth_Bandolier_MA02', type: 'cloth' },
    { name: 'Cloth_Skull_Belt_PA01', type: 'cloth' }   
  ],
  cold_arms: [
    { name: 'ColdArms_Bottle_Rose_RA01', type: 'cold_arms' },
    { name: 'ColdArms_Grappling_Hook_PA01', type: 'cold_arms' },
    { name: 'ColdArms_Chopper_Knife_KA01', type: 'cold_arms' },
    { name: 'ColdArms_Katana_NA01', type: 'cold_arms' },
  ],
  face: [
    { name: 'Face_Sunglasses_RA01', type: 'face' },
    { name: 'Face_Visor_VR_VR01', type: 'face' },
    { name: 'Face_Cowboy_Scarf_CA01', type: 'face' },
    { name: 'Empty', type: 'face' }
  ],
  fire_arms: [
    { name: 'FireArms_Revolver_CA01', type: 'fire_arms' },
    { name: 'FireArms_Grenade_Launcher_AA03', type: 'fire_arms' },
    { name: 'FireArms_Handgun_SMG_AA04', type: 'fire_arms' },
    { name: 'FireArms_Assault_Rifle_AA01', type: 'fire_arms' },
    { name: 'FireArms_Assault_Rifle_AA02', type: 'fire_arms' },
    { name: 'FireArms_Sniper_Rifle_AA05', type: 'fire_arms' }
  ],
  teeth: [
    { name: 'Teeth_Grga_AA02', type: 'teeth' },
    { name: 'Teeth_Hollywood_AA01', type: 'teeth' },
    { name: 'Teeth_Oldstyle_AA04', type: 'teeth' },
    { name: 'Teeth_Sharp_AA03', type: 'teeth' },
    { name: 'Teeth_Grillz_Silver_RA01', type: 'teeth' }   
  ],
  eyes: [
    { name: 'Eyes_Blue_AA01', type: 'eyes' },
    { name: 'Eyes_Green_AA02', type: 'eyes' },
    { name: 'Eyes_Zombie_ZA01', type: 'eyes' }
  ],
  exo: [
    { name: 'Exo_Snowwhite_Exoskeleton_AA02', type: 'exo' },
    { name: 'Exo_Steel_Exoskeleton_AA01', type: 'exo' },
    { name: 'Exo_Military_Exoskeleton_MA01', type: 'exo' }   
  ],
  head: [
    { name: 'Head_Fresh_Lemon_AA01', type: 'head' },
    { name: 'Head_Zombie_ZA01', type: 'head' },
    { name: 'Head_Clementine_AA02', type: 'head' },
    { name: 'Head_Lime_AA03', type: 'head' }
  ],
  shoes: [
    { name: 'Shoes_Kicks_SA01', type: 'shoes' },
    { name: 'Shoes_Armored_Shoes_AA01', type: 'shoes' },
    { name: 'Shoes_Military_Shoes_MA01', type: 'shoes' },
    { name: 'Shoes_Kicks_SA02', type: 'shoes' }
  ]
}

function random(array: OutfitType[]): OutfitType {
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
            flavour: random(outfits.exo).name,
            name: "exo"
          }
        },
        {
          type: "0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>",
          fields: {
            flavour: random(outfits.eyes).name,
            name: "eyes"
          }
        },
        {
          type: "0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>",
          fields: {
            flavour: random(outfits.head).name,
            name: "head"
          }
        },
        {
          type: "0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>",
          fields: {
            flavour: random(outfits.face).name,
            name: "face"
          }
        },
        {
          type: "0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>",
          fields: {
            flavour: random(outfits.teeth).name,
            name: "teeth"
          }
        },
        {
          type: "0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>",
          fields: {
            flavour: random(outfits.back).name,
            name: "back"
          }
        },
        {
          type: "0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>",
          fields: {
            flavour: random(outfits.cap).name,
            name: "cap"
          }
        },
        {
          type: "0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>",
          fields: {
            flavour: random(outfits.cloth).name,
            name: "cloth"
          }
        },
        {
          type: "0xd0b290b77ab543171422cffd7968d0ad749f29bf::trait::Trait<0x1::string::String, 0x1::string::String>",
          fields: {
            flavour: random([...outfits.cold_arms, ...outfits.fire_arms]).name,
            name: "weapon"
          }
        },
        {
          type: "0xd0b290b77ab543171422cffd7968d0ad749f22ff::trait::Trait<0x1::string::String, 0x1::string::String>",
          fields: {
            flavour: random(outfits.shoes).name,
            name: "shoes"
          }
        }        
      ],
      url: "https://promo.battlemon.com/assets/default-lemon.png"
    }
  }

  return lemon;
}