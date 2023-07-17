import {
  useAccount,
  useDisconnect as useDisconnectWagmi,
  useSignMessage,
} from 'wagmi';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';

const cookiesList = ['auth_token', 'current_address'];

export const useAuth = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const [cookies, setCookie] = useCookies(cookiesList);
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

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

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!address) return;
    if (cookies.current_address !== address) {
      setCookie('current_address', address);
      connectAuthServer();
    }
  }, [address]);

  if (address && cookies.auth_token && hasMounted) {
    return { isAuthorized: true, address };
  }
  return { address, connectAuthServer };
};

export const useDisconnect = () => {
  const [, , removeCookie] = useCookies(cookiesList);
  const { disconnect: disconnectWagmi } = useDisconnectWagmi();

  const disconnect = () => {
    removeCookie('auth_token');
    removeCookie('current_address');
    disconnectWagmi();
  };

  return { disconnect };
};
