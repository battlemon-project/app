import React from 'react';
import Image from 'next/image';

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
  return (
    <div
      style={{ background: '#000000' }}
      className="vh-100 w-100 position-absolute top-0 left-0 d-flex align-items-center justify-content-center"
      id="sceneLoaderElement"
    >
      <div
        style={{
          display: 'inline-block',
          width: '256px',
          height: '256px',
          position: 'relative',
        }}
      >
        <div className="text-light mx-auto w-100 text-center h5">
          {isConnected ? '' : 'You need to Sign In'}
        </div>
        <Image
          src={`${process.env.NEXT_PUBLIC_STATIC}/assets/btlmn_logo_inner_256.png`}
          alt="Battlemon Logo inner."
          width={256}
          height={256}
          className="position-absolute"
        />
        <Image
          src={`${process.env.NEXT_PUBLIC_STATIC}/assets/btlmn_logo_outer_256.png`}
          alt="Battlemon Logo Outer."
          width={256}
          height={256}
          className={`position-absolute ${isConnected ? 'spinner' : ''}`}
        />
      </div>
    </div>
  );
};
