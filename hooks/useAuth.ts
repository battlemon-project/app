import {
  useAccount,
  useDisconnect as useDisconnectWagmi,
  useSignMessage,
} from 'wagmi';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import { useWeb3Modal } from '@web3modal/react';
import { useRouter } from 'next/router';
import { useReferral } from './useReferral';
import toast from 'react-hot-toast';

const cookiesList = ['auth_token', 'current_address'];

export interface UserType {
  userId: string;
  address: string;
  referralCode: string;
  conductorAddress: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [cookies, setCookie] = useCookies(cookiesList);
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { open } = useWeb3Modal();
  const router = useRouter();
  const { addReferral, getConductorAddress, isReferral } = useReferral();

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

  const fetchUserProfile = async (token: string) => {
    const data = await fetch('/battlemon-api/users/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return (await data.json()) as UserType;
  };

  const authWallet = async (
    token: string,
    address: string | undefined,
    signature: string,
    conductorAddress: string = ''
  ) => {
    const data = await fetch('/battlemon-api/auth/wallet', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address, signature, conductorAddress }),
    });
    const result = await data.json();
    return result as { token: string; userId: string };
  };

  const connectAuthServer = async () => {
    if (!address) {
      open();
      return;
    }
    const { token: guestToken } = await fetchGuest();
    const { nonce } = await getNonce(guestToken);
    let signature: `0x${string}` | null = null;
    try {
      signature = await signMessageAsync({
        message: `Signing nonce: ${nonce}`,
      });
      const { token } = await authWallet(guestToken, address, signature);
      setAuthToken(token);
    } catch (e) {}
  };

  const connectToAuthServerWithReferral = async () => {
    if (!address) {
      open();
      return;
    }
    const { token: guestToken } = await fetchGuest();
    const code = router.query.code as string;
    let hasError = false;
    const conductorAddress = await getConductorAddress(guestToken, code).catch(
      (e: Error) => {
        toast.error(e.message);
        hasError = true;
        router.push('/referral');
      }
    );
    if (hasError) return;
    const { nonce } = await getNonce(guestToken);
    try {
      let signature: `0x${string}` | null = null;
      signature = await signMessageAsync({
        message: `Signing nonce: ${nonce}`,
      });

      const { token } = await authWallet(
        guestToken,
        address,
        signature,
        conductorAddress ? conductorAddress.address : ''
      );

      const profile = await fetchUserProfile(token);
      const isRegisteredUser =
        profile.conductorAddress !== conductorAddress?.address;
      if (isRegisteredUser) {
        toast.error(
          'You cannot join to referral program, because account was already registered'
        );
        setAuthToken(token);
        router.push('/referral');
        return;
      }
      const isAccountReferral = await isReferral(profile.address);
      if (isAccountReferral) {
        toast.error(
          'You cannot join to referral program, because account was already registered'
        );
        setAuthToken(token);
        router.push('/referral');
        return;
      }

      await addReferral(conductorAddress.address);
      setAuthToken(token);
      router.push('/referral');
    } catch (e) {}
  };

  const setAuthToken = (token: string) => {
    setCookie('auth_token', token, {
      expires: new Date(((d) => d.setDate(d.getDate() + 365))(new Date())),
    });
  };

  useEffect(() => {
    setHasMounted(true);

    const token = cookies.auth_token;
    if (token && Boolean(fetchUserProfile)) {
      fetchUserProfile(token).then((d) => {
        setUser(d);
      });
    }
  }, []);

  const defaultReturn = {
    address,
    user,
    setUser,
    fetchUserProfile,
  };

  if (address && cookies.auth_token && hasMounted) {
    return {
      isAuthorized: true,
      ...defaultReturn,
    };
  }

  return {
    ...defaultReturn,
    connectAuthServer,
    connectToAuthServerWithReferral,
    isAuthorized: false,
    fetchGuest,
    getNonce,
    authWallet,
  };
};

export const useDisconnect = () => {
  const [, , removeCookie] = useCookies(cookiesList);
  const { disconnect: disconnectWagmi } = useDisconnectWagmi();
  const { setUser } = useAuth();

  const disconnect = () => {
    removeCookie('auth_token');
    removeCookie('current_address');
    setUser(null);
    disconnectWagmi();
  };

  return { disconnect };
};
