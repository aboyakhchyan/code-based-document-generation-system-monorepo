import { UserRole, type IUser } from "@/types";
import React, { createContext } from "react";

interface IAuthContextType {
  isStudent: boolean;
  isLecturer: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  user: IUser;
}

interface IAuthProviderProps {
  children: React.ReactNode;
}

export const AuthContextProvider = createContext<IAuthContextType | undefined>(
  undefined
);

const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  return (
    <AuthContextProvider.Provider
      value={{
        isStudent: false,
        isLecturer: false,
        isAdmin: false,
        isLoading: false,
        user: { email: "Avo", role: UserRole.ADMIN },
      }}
    >
      {children}
    </AuthContextProvider.Provider>
  );
};

export default AuthProvider;
