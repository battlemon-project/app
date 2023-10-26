import React from 'react';
import Layout from '../components/Layout';

const Vault = () => {
  return (
    <div className="container">
      <div className="d-flex flex-wrap gap-4">
        <div className="shop-banner shop-banner-lemons mb-2">
        </div>
        <div className="shop-banner shop-banner-items mb-2">
        </div>
        <div className="shop-banner shop-banner-chests mb-2">
        </div>
        <div className="shop-banner shop-banner-keys mb-2">
        </div>
        <div className="shop-banner shop-banner-pickaxes mb-2">
        </div>
        <div className="shop-banner shop-banner-marketplace mb-2">
        </div>
      </div>
    </div>
  );
};

Vault.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;
export default Vault;
