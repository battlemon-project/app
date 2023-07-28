import React, { useContext, useEffect, useState } from 'react';
import { useWeb3Modal } from '@web3modal/react';
import { useAuth, useDisconnect } from '../hooks/useAuth';
import Link from 'next/link';
import Image from 'next/image';
import { EthereumClientContext } from '../context/EthereumClientContext/EthereumClientContext';

export const ConnectEth: React.FC = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const { open } = useWeb3Modal();
  const { address } = useAuth();
  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const onMouseEnter = () => setIsOpen(true);
  const onMouseLeave = () => setIsOpen(false);
  const { ethereumClient } = useContext(EthereumClientContext);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const openUTORG = async () => {
    ethereumClient?.connectWalletConnect((uri) => {
      if (uri) {
        window.open(
          `https://link.UTORG.com/zp0f/wc?uri=${encodeURIComponent(
            encodeURIComponent(uri)
          )}`,
          '_newtab'
        );
      }
    });
  };

  return (
    <ul className="navbar-nav mb-2 mb-lg-0 fs-5">
      <li className="nav-item dropdown">
        {address ? (
          <div className="relative">
            <button
              className="flex border border-white py-2.5 px-5 rounded-xl text-white font-normal dropdown-toggle hover:text-black hover:bg-white transition-all"
              id="navbarDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              <span className="short_address">
                <span className="ellipsis">{address}</span>
                <span className="indent">{address}</span>
              </span>
            </button>
            {isOpen ? (
              <ul
                className="absolute flex flex-col top-11 left-0 border border-white w-full  rounded-xl transition-all overflow-hidden"
                aria-labelledby="navbarDropdown"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
              >
                <li>
                  <button
                    className=" block w-full py-2.5 px-5 text-white hover:text-black hover:bg-white"
                    onClick={disconnect}
                  >
                    Sign Out
                  </button>
                </li>
              </ul>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-row flex-wrap gap-4 justify-center">
            <button
              className="block border border-white w-52 py-2.5 px-5 rounded-xl text-white hover:text-black hover:bg-white transition-all"
              onClick={open}
            >
              Connect
            </button>

            <button
              className="flex flex-row block border border-white w-52 py-2.5 px-5 rounded-xl text-white hover:text-white bg-slate-800/50 hover:bg-black transition-all"
              onClick={openUTORG}
            >
              <Image
                className="rounded"
                src="https://static.utorg.com/icons/app.png"
                alt="Utorg icon"
                width={28}
                height={28}
              />
              <span className="mx-auto">Connect Utorg</span>
            </button>
          </div>
        )}
      </li>
    </ul>
  );
};
