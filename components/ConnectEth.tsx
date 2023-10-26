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
    <ul className="navbar-nav mb-2 mb-lg-0">
      <li className="nav-item dropdown" style={{position: 'relative', top: '-9px'}}>
        {address ?
          <>
            <button className="btn py-2 btn-outline-light dropdown-toggle text-start" id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false">
              <span className="short_address">
                <span className="ellipsis">{address}</span>
                <span className="indent">{address}</span>
              </span>
            </button>
            <ul className="dropdown-menu w-100" aria-labelledby="navbarDropdown">
              <li><a className="dropdown-item" href={"#"} onClick={disconnect}>Sign Out</a></li>
            </ul>
          </>
          :
          <button className="btn py-2 btn-outline-light" onClick={() => open()}>
            Connect
          </button>
        }
      </li>
    </ul>
  );
};
