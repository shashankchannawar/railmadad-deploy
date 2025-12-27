// context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

import API_BASE_URL from "../config";

const BASE_URL = API_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (tokenValue, userData) => {
    localStorage.setItem("token", tokenValue);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(tokenValue);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!token;
  };

  const isSuperAdmin = () => {
    return user?.role === "super_admin";
  };

  const isCategoryAdmin = () => {
    return user?.role === "category_admin";
  };

  const isUser = () => {
    return user?.role === "user";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        BASE_URL,
        login,
        logout,
        isAuthenticated,
        isSuperAdmin,
        isCategoryAdmin,
        isUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};