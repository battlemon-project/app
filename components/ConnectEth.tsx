import React, { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
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
  const { signMessageAsync } = useSignMessage();

  const signOut = () => {
    removeCookie('auth_token');
    removeCookie('current_address');
    disconnect();
  };

  const handleConnect = async () => {
    connect({ chainId: 59140 });
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
      signature = await signMessageAsync({
        message: `Signing nonce: ${nonce}`,
      });
      const { token } = await authWallet(guestToken, address, signature);
      setCookie('auth_token', token, {
        expires: new Date(((d) => d.setDate(d.getDate() + 365))(new Date())),
      });
    } catch (e) {}
  };

  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const onMouseEnter = () => setIsOpen(true);
  const onMouseLeave = () => setIsOpen(false);

  useEffect(() => {
    if (!address) return;
    if (cookies.current_address !== address) {
      setCookie('current_address', address);
      connectAuthServer();
    }
  }, [address]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <ul className="navbar-nav mb-2 mb-lg-0 fs-5">
      <li className="nav-item dropdown">
        {isConnected && address ? (
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
                className="absolute top-11 left-0 border border-white w-full py-2.5 px-5 rounded-xl text-white hover:text-black hover:bg-white transition-all"
                aria-labelledby="navbarDropdown"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
              >
                <li>
                  <button className="dropdown-item" onClick={signOut}>
                    Sign Out
                  </button>
                </li>
              </ul>
            ) : null}
          </div>
        ) : (
          <button
            className="block border border-white w-52 py-2.5 px-5 rounded-xl text-white hover:text-black hover:bg-white transition-all"
            onClick={handleConnect}
          >
            Connect
          </button>
        )}
      </li>
    </ul>
  );
};
