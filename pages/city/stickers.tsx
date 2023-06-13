import React, { Suspense, useEffect } from 'react';
import Layout from '../../components/Layout';
import { BabylonLoader } from '../../components/BabylonLoader';
import dynamic from 'next/dynamic';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';

const HomeScene = dynamic(async () => await import('../../scenes/ChestScene'), {
  suspense: true,
});

const Stickers = () => {
  const { status } = useAccount();
  const router = useRouter();

  if (status === 'disconnected') {
    router.replace('/');
  }

  useEffect(() => {
    document?.body.classList.add('babylon-page');

    return function cleanup() {
      document?.body.classList.remove('babylon-page');
    };
  }, []);

  return (
    <div className="container pt-5 mt-5 mx-auto">
      <Suspense fallback={<BabylonLoader isConnected={true} />}>
        <HomeScene />
      </Suspense>
    </div>
  );
};

Stickers.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;
export default Stickers;
