import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🔹 vérifier token à chaque rendu ou changement
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const login = (token, id_user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("id_user", id_user);
    setIsAuthenticated(true); // 🔹 re-render immédiat
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id_user");
    setIsAuthenticated(false); // 🔹 re-render immédiat
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
