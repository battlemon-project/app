import React from 'react';
import Layout from '../../components/Layout';

const Mixing = () => {
  return (
    <div className="container px-4 text-center mx-auto flex justify-center pt-24">
      <video className="rounded-xl" loop autoPlay playsInline muted>
        <source src="/resources/video/mixing.mp4" type="video/mp4" />
      </video>
    </div>
  );
};

Mixing.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;
export default Mixing;
