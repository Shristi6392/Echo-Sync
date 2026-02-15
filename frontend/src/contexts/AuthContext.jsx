import { createContext, useMemo, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("ecoUser");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading] = useState(false);

  const login = async (email, password) => {
    const { data } = await api.post("/api/auth/login", { email, password });
    localStorage.setItem("ecoUser", JSON.stringify(data));
    setUser(data);
    return data;
  };

  const signup = async (payload) => {
    const { data } = await api.post("/api/auth/signup", payload);
    localStorage.setItem("ecoUser", JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("ecoUser");
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, signup, logout }), [
    user,
    loading,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const AuthContextInstance = AuthContext;
