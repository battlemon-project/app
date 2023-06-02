import React from 'react';
import Layout from '../../components/Layout';
import {
  VaultCard,
  type VaultCardType,
} from '../../components/VaultCard/VaultCard';

const cards: VaultCardType[] = [
  {
    title: 'NFT',
  },
  {
    title: 'LJC',
    subtitle: 'TOKEN',
  },
];

const Vault = () => {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="flex justify-center gap-6 max-w-4xl mx-auto flex-col sm:flex-row">
        {cards.map((card, i) => (
          <div className="basis-1/2" key={i}>
            <VaultCard title={card.title} subtitle={card.subtitle} />
          </div>
        ))}
      </div>
    </div>
  );
};

Vault.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;
export default Vault;
