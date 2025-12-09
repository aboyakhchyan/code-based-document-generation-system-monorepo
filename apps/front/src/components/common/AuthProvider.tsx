import { type IUser } from "@/types";
import React, { createContext } from "react";
import { useAuthState } from "@/hooks";

interface IAuthContextType {
  user: IUser | undefined;
  isLoading: boolean;
  isError: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isUser: boolean;
  login: (email: string, password: string) => void;
  loginAsync: (email: string, password: string) => Promise<any>;
  logout: () => void;
  logoutAsync: () => Promise<any>;
  refetchUser: () => void;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
}

interface IAuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<IAuthContextType | undefined>(undefined);

const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const auth = useAuthState();

  return (
    <AuthContext.Provider
      value={{
        user: auth.user,
        isLoading: auth.isLoading,
        isError: auth.isError,
        isAuthenticated: auth.isAuthenticated,
        isAdmin: auth.isAdmin,
        isUser: auth.isUser,
        login: auth.login,
        loginAsync: auth.loginAsync,
        logout: auth.logout,
        logoutAsync: auth.logoutAsync,
        refetchUser: auth.refetchUser,
        isLoggingIn: auth.isLoggingIn,
        isLoggingOut: auth.isLoggingOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
