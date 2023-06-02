import React, { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { signMessage } from '@wagmi/core';
import { useCookies } from 'react-cookie';
import { InjectedConnector } from 'wagmi/connectors/injected';

export const ConnectEth: React.FC = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies([
    'auth_token',
    'current_address',
  ]);
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  const signOut = () => {
    //removeCookie('auth_token');
    disconnect();
  };

  const handleConnect = async () => {
    connect();
  };

  const fetchGuest = async () => {
    const data = await fetch('/battlemon-api/auth/guest', { method: 'POST' });
    const result = await data.json();
    return result as { token: string };
  };

  const getNonce = async (token: string) => {
    const data = await fetch('/battlemon-api/auth/nonce', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const result = await data.json();
    return result as { nonce: string };
  };

  const authWallet = async (
    token: string,
    address: string | undefined,
    signature: string
  ) => {
    const data = await fetch('/battlemon-api/auth/wallet', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address, signature }),
    });
    const result = await data.json();
    return result as { token: string; userId: string };
  };

  const connectAuthServer = async () => {
    const { token: guestToken } = await fetchGuest();
    const { nonce } = await getNonce(guestToken);
    let signature: `0x${string}` | null = null;
    try {
      signature = await signMessage({
        message: `Signing nonce: ${nonce}`,
      });
      const { token } = await authWallet(guestToken, address, signature);
      setCookie('auth_token', token, {
        expires: new Date(((d) => d.setDate(d.getDate() + 365))(new Date())),
      });
    } catch (e) {}
  };

  useEffect(() => {
    if (!address) return;
    if (cookies.current_address !== address) {
      setCookie('current_address', address);
      removeCookie('auth_token');
      setTimeout(() => connectAuthServer(), 5000);
    }
    if (!cookies.auth_token) {
      connectAuthServer();
    }
  }, [address]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

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
