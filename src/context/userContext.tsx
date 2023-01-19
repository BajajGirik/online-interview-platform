import React, { useEffect, useState, createContext } from "react";
import { UserProfile, UserAuthResponse } from "../types/api";
import { AppRoutes, LOCAL_STORAGE_KEY } from "../constants";
import { autoLogin_api } from "../api";
import { useNavigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

type UserContextType = {
  isLoading: boolean;
  user: UserProfile | null;
  errorMessage: string | null;
  onChangeUser: (user: UserAuthResponse) => void;
  logout: () => void;
};

const defaultContextValue: UserContextType = {
  isLoading: true,
  user: null,
  errorMessage: null,
  onChangeUser: () => {},
  logout: () => {}
};

const UserContext = createContext<UserContextType>(defaultContextValue);

export const UserContextProvider = ({ children }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const onChangeUser = (apiResponse: UserAuthResponse) => {
    setUser(apiResponse.userProfile);
    localStorage.setItem(LOCAL_STORAGE_KEY, apiResponse.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }
    // try autologin
    const autoLogin = async () => {
      try {
        setIsLoading(true);
        const data = await autoLogin_api();
        onChangeUser(data);
      } catch (error) {
        console.log(error);
        setErrorMessage((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    autoLogin();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!user) navigate("/signin");
    if (user) navigate(AppRoutes.home);
  }, [user, isLoading]);

  return (
    <UserContext.Provider
      value={{
        user,
        onChangeUser,
        isLoading,
        errorMessage,
        logout
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export default UserContext;
