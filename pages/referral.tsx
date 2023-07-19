import React from 'react';
import Layout from '../components/Layout';

const Referral = () => {
  return (
    <div className="flex gap-10 w-full container mx-auto px-4">
      <div className="basis-2/3 text-white">
        <div className="rounded-xl min-h-96 border border-white mb-10 p-7">
          <h2 className="text-3xl font-bold mb-3">Create referral</h2>
          <button className="px-6 py-2 bg-white text-black rounded-xl">
            Create
          </button>
        </div>
        <div className="rounded-xl min-h-96 border border-white p-7">
          <h2 className="text-3xl font-bold mb-3">Link to existing referral</h2>
          <button className="px-6 py-2 bg-white text-black rounded-xl">
            Link
          </button>
        </div>
      </div>
      <div className="basis-1/3 p-7 bg-blue bg-opacity-30 rounded-xl text-white">
        <h2 className="text-3xl font-bold mb-5">What you will get</h2>
        <p className="text-lg">
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout. The point of
          using Lorem Ipsum is that it has a more-or-less normal distribution of
          letters, as opposed to using 'Content here, content here', making it
          look like readable English. Many desktop publishing packages and web
          page editors now use Lorem Ipsum as their default model text, and a
          search for 'lorem ipsum' will uncover many web sites still in their
          infancy. Various versions have evolved over the years, sometimes by
          accident, sometimes on purpose (injected humour and the like).
        </p>
      </div>
    </div>
  );
};

Referral.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default Referral;
