import React, { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { signMessage } from '@wagmi/core';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { useCookies } from 'react-cookie';

export const ConnectEth: React.FC = () => {
  const [cookies, setCookie] = useCookies(['auth_token'])
  const [hasMounted, setHasMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  const signOut = () => {
    disconnect();
  };

  const handleConnect = async () => {
    connect();
  }

  const fetchGuest = async () => {
    const data = await fetch('/api/auth/guest', { method: 'POST' })
    const result = await data.json();
    return result as { token: string };
  }
  
  const getNonce = async (token: string) => {
    const data = await fetch('/api/auth/nonce', {
      headers: {Authentication: `Bearer ${token}`}
    })
    const result = await data.json();
    return result as { nonce: string };
  }

  const authWallet = async (token: string, address: string | undefined, signature: string) => {
    const data = await fetch('/api/auth/wallet', {
      method: 'POST',
      headers: {Authentication: `Bearer ${token}`},
      body: JSON.stringify({ address, signature })  
    })
    const result = await data.json();
    return result as { token: string, userId: string };
  }

  const connectAuthServer = async () => {
    const { token: guestToken } = await fetchGuest();
    const { nonce } = await getNonce(guestToken);
    console.log(nonce)
    let signature: `0x${string}` | undefined = undefined
    try {
      signature = await signMessage({
        message: `Signing nonce: ${nonce}`,
      })
      const { token, userId } = await authWallet(guestToken, address, signature)
      console.log(token, userId)
    } catch(e) {}
  }

  useEffect(() => {
    if (!address) return;
    connectAuthServer();
  }, [address]);

  useEffect(() => {
    setHasMounted(true);
    //fetchGuest();
  }, []);

  // Render
  if (!hasMounted) return null;

  return (
    <ul className="navbar-nav mb-2 mb-lg-0 fs-5">
      <li
        className="nav-item dropdown"
        style={{ position: 'relative', top: '-9px' }}
      >
        {isConnected && address ? (
          <>
            <button
              className="btn btn-lg btn-outline-light dropdown-toggle text-start"
              id="navbarDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span className="short_address">
                <span className="ellipsis">{address}</span>
                <span className="indent">{address}</span>
              </span>
            </button>
            <ul
              className="dropdown-menu w-100"
              aria-labelledby="navbarDropdown"
            >
              <li>
                <a className="dropdown-item" href={'#'} onClick={signOut}>
                  Sign Out
                </a>
              </li>
            </ul>
          </>
        ) : (
          <button
            className="btn btn-lg btn-outline-light"
            onClick={handleConnect}
          >
            Connect
          </button>
        )}
      </li>
    </ul>
  );
};
