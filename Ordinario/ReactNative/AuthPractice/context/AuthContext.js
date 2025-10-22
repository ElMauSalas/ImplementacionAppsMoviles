import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);

  const login = async (token) => {
    await AsyncStorage.setItem("userToken", token);
    setUserToken(token);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("userToken");
    setUserToken(null);
  };

  const checkToken = async () => {
    const token = await AsyncStorage.getItem("userToken");
    if (token) setUserToken(token);
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ userToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
