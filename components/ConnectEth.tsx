import React, { useEffect, useState } from 'react';
import { useWeb3Modal } from '@web3modal/react';
import { useAuth, useDisconnect } from '../hooks/useAuth';
import Link from 'next/link';

export const ConnectEth: React.FC = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const { open } = useWeb3Modal();
  const { address } = useAuth();
  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const onMouseEnter = () => setIsOpen(true);
  const onMouseLeave = () => setIsOpen(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

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
                  <Link
                    className=" block w-full text-center py-2.5 px-5 text-white hover:text-black hover:bg-white"
                    href="/referral"
                  >
                    Referral
                  </Link>
                </li>
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
          <button
            className="block border border-white w-52 py-2.5 px-5 rounded-xl text-white hover:text-black hover:bg-white transition-all"
            onClick={open}
          >
            Connect
          </button>
        )}
      </li>
    </ul>
  );
};
