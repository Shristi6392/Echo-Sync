import { createContext, useMemo, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

const getStoredSession = () => {
  const raw = localStorage.getItem("ecoUser");
  if (!raw) {
    return { user: null, token: null };
  }
  const parsed = JSON.parse(raw);
  if (parsed?.user) {
    return { user: parsed.user, token: parsed.token || null };
  }
  return { user: parsed, token: null };
};

export const AuthProvider = ({ children }) => {
  const stored = getStoredSession();
  const [user, setUser] = useState(() => stored.user);
  const [loading] = useState(false);

  const login = async (email, password) => {
    const { data } = await api.post("/api/auth/login", { email, password });
    const nextUser = data?.user || data;
    const nextToken = data?.token || null;
    localStorage.setItem(
      "ecoUser",
      JSON.stringify({ user: nextUser, token: nextToken })
    );
    setUser(nextUser);
    return nextUser;
  };

  const signup = async (payload) => {
    const { data } = await api.post("/api/auth/signup", payload);
    const nextUser = data?.user || data;
    const nextToken = data?.token || null;
    localStorage.setItem(
      "ecoUser",
      JSON.stringify({ user: nextUser, token: nextToken })
    );
    setUser(nextUser);
    return nextUser;
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
