import React from 'react';
import Layout from '../../components/Layout';
import {
  FarmingCard,
  type FarmingCardType,
} from '../../components/FarmingCard/FarmingCard';
import Pick1 from '../../public/resources/assets/256/IcePick-1.png';
import Gem1 from '../../public/resources/assets/256/Gem-Blue.png';
import Pick2 from '../../public/resources/assets/256/IcePick-2.png';
import Gem2 from '../../public/resources/assets/256/Gem-Yellow.png';
import Pick3 from '../../public/resources/assets/256/IcePick-3.png';
import Gem3 from '../../public/resources/assets/256/Gem-Orange.png';

const farmingCards: FarmingCardType[] = [
  {
    title: 'Mining Low',
    gemURL: Gem1,
    pickURL: Pick1,
  },
  {
    title: 'Mining Medium',
    gemURL: Gem2,
    pickURL: Pick2,
  },
  {
    title: 'Mining High',
    gemURL: Gem3,
    pickURL: Pick3,
  },
  {
    title: 'Mining Low',
    gemURL: Gem1,
  },
  {
    title: 'Mining Medium',
    gemURL: Gem2,
  },
  {
    title: 'Mining High',
    gemURL: Gem3,
  },
];

const Defi = () => {
  return (
    <div className="container mx-auto px-4 pt-14">
      <div className="grid grid-cols-12 gap-6 mt-5">
        {farmingCards.map((card, i) => (
          <div className="col-span-full md:col-span-6 xl:col-span-4" key={i}>
            <FarmingCard {...card} />
          </div>
        ))}
      </div>
    </div>
  );
};

Defi.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;
export default Defi;
