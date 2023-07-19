import React, { useContext, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/router';
import { useWeb3Modal } from '@web3modal/react';
import { useAccount } from 'wagmi';
import { AuthContext } from '../../context/AuthContext/AuthContext';

const ReferrralInvite = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const { isAuthorized, connectToAuthServerWithReferral } = useAuth();
  const router = useRouter();
  const { open } = useWeb3Modal();
  const { user, setUser } = useContext(AuthContext);
  const { address } = useAccount();

  const signTransaction = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    connectToAuthServerWithReferral?.();
  };

  useEffect(() => {}, [address]);

  if (user) {
    router.push('/referral');
    return;
  }

  return (
    <div className="container mx-auto px-4 pt-20 flex gap-10">
      <div className="rounded-xl min-h-96 h-fit basis-2/3 border border-white p-7">
        {!address ? (
          <>
            <h1 className="text-3xl font-bold text-white mb-5">
              Connect wallet to join to referral program
            </h1>
            <button
              onClick={open}
              className="flex border border-white py-2.5 px-5 rounded-xl text-white font-normal dropdown-toggle hover:text-black hover:bg-white transition-all"
            >
              Connect
            </button>
          </>
        ) : !isAuthorized ? (
          <>
            <h1 className="text-3xl font-bold text-white mb-5">
              Sign a transaction to join to referral program
            </h1>
            <div className="text-white mx-auto w-full font-bold text-xl">
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
          </>
        ) : null}
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
ReferrralInvite.getLayout = (page: React.ReactElement) => (
  <Layout>{page}</Layout>
);

export default ReferrralInvite;
