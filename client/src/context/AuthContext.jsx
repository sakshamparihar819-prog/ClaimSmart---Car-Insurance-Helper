import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, tokenStore } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // If a token is saved, we're "loading" until /auth/me confirms it's still valid.
  const [loading, setLoading] = useState(Boolean(tokenStore.get()));

  useEffect(() => {
    if (!tokenStore.get()) return;
    api
      .me()
      .then((data) => setUser(data.user))
      .catch((err) => {
        // Only drop the token if the server actually rejected it (not on a network blip).
        if (err.status === 401) tokenStore.clear();
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await api.login({ email, password });
    tokenStore.set(data.token);
    setUser(data.user);
  }

  async function register(name, email, password) {
    const data = await api.register({ name, email, password });
    tokenStore.set(data.token);
    setUser(data.user);
  }

  // Stable identity, so effects that depend on `logout` don't re-run on every render.
  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
