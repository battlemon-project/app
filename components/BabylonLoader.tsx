import React from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { useAuth } from '../hooks/useAuth';

export interface BabylonLoaderType {
  babylon: boolean;
  data: boolean;
}

interface BabylonLoaderProps {
  isConnected: boolean;
}

export const BabylonLoader: React.FC<BabylonLoaderProps> = ({
  isConnected,
}: {
  isConnected: boolean;
}) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const { connectAuthServer } = useAuth();

  const signTransaction = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    connectAuthServer?.();
  };

  return (
    <div
      className="bg-black h-screen w-full fixed top-0 left-0 flex items-center justify-center"
      id="sceneLoaderElement"
    >
      <div className="relative inline-block w-64 h-64">
        <div className="text-white mx-auto w-full text-center font-bold text-xl">
          {isConnected ? (
            ''
          ) : (
            <>
              {connectAuthServer ? (
                <>
                  You need to
                  <a
                    href="#"
                    style={{
                      textDecoration: 'underline',
                      color: '#228efa',
                      padding: '0 0 0 6px',
                    }}
                    onClick={signTransaction}
                  >
                    Sign Transaction
                  </a>
                </>
              ) : (
                <>You need to Sign In</>
              )}
            </>
          )}
        </div>
        <Image
          src={`${process.env.NEXT_PUBLIC_STATIC}/assets/btlmn_logo_inner_256.png`}
          alt="Battlemon Logo inner."
          width={256}
          height={256}
          className="absolute"
        />
        <Image
          src={`${process.env.NEXT_PUBLIC_STATIC}/assets/btlmn_logo_outer_256.png`}
          alt="Battlemon Logo Outer."
          width={256}
          height={256}
          className={classNames({ spinner: isConnected }, 'absolute')}
        />
      </div>
    </div>
  );
};
