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
            <button className="btn px-4 py-2 btn-outline-light dropdown-toggle text-start rounded-4" id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false" style={{width: '226px'}}>
              {address.substring(0,9)}...{address.slice(-9)}
            </button>
            <ul className="dropdown-menu w-100 rounded-4" aria-labelledby="navbarDropdown">
              <li><a className="dropdown-item rounded-4" href={"#"} onClick={disconnect}>Sign Out</a></li>
            </ul>
          </>
          :
          <button className="btn px-4 py-2 btn-outline-light rounded-4" onClick={() => open()} style={{width: '226px'}}>
            Connect
          </button>
        }
      </li>
    </ul>
  );
};
