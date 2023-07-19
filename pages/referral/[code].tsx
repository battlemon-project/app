import React, { useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/router';
import { useWeb3Modal } from '@web3modal/react';
import { useAccount } from 'wagmi';

const ReferrralInvite = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const { isAuthorized, user, connectToAuthServerWithReferral } = useAuth();
  const router = useRouter();
  const { open } = useWeb3Modal();
  const { address } = useAccount();

  const signTransaction = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    connectToAuthServerWithReferral?.();
  };

  useEffect(() => {}, [address]);

  if (user) {
    router.push('/');
    return;
  }

  if (!address) {
    return (
      <div className="container mx-auto px-4 pt-20 flex flex-col items-center">
        <h1 className="text-3xl text-center font-bold text-white mb-5">
          Connect wallet to join to referral program
        </h1>
        <button
          onClick={open}
          className="flex border border-white py-2.5 px-5 rounded-xl text-white font-normal dropdown-toggle hover:text-black hover:bg-white transition-all"
        >
          Connect
        </button>
      </div>
    );
  }

  if (!isAuthorized)
    return (
      <div className="container mx-auto px-4 pt-20 flex flex-col items-center">
        <h1 className="text-3xl text-center font-bold text-white mb-5">
          Sign a transaction to join to referral program
        </h1>
        <div className="text-white mx-auto w-full text-center font-bold text-xl">
          {connectToAuthServerWithReferral ? (
            <>
              <a
                className="block underline pr-1.5"
                href="#"
                style={{
                  color: '#228efa',
                }}
                onClick={signTransaction}
              >
                Sign Transaction
              </a>
            </>
          ) : (
            <>You need to Sign In</>
          )}
        </div>
      </div>
    );

  return <div></div>;
};
ReferrralInvite.getLayout = (page: React.ReactElement) => (
  <Layout>{page}</Layout>
);

export default ReferrralInvite;
