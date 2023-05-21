import React from 'react';
import Layout from '../../components/Layout';
import VaultCard, {
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
    <div className="container">
      <div className="row justify-content-center mt-5 gy-4">
        {cards.map((card, i) => (
          <div className="col-sm-12 col-md-6 col-lg-4" key={i}>
            <VaultCard title={card.title} subtitle={card.subtitle} />
          </div>
        ))}
      </div>
    </div>
  );
};

Vault.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;
export default Vault;
