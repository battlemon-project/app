import type React from 'react';
import { createContext } from 'react';

export interface UserType {
  userId: string;
  address: string;
  referralCode: string;
  conductorAddress: string;
}
export interface ValueType {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
}
export const AuthContext = createContext<ValueType>({
  user: null,
  setUser: () => {},
});

export const AuthProvider = AuthContext.Provider;
