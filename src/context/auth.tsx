import { createContext, useContext, useState, useEffect } from "react";

type User = {
  id: string;
  email: string;
  subscriptionStatus: string;
};

type AuthContextType = {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, SetUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("api/auth/me")
        .then((res) => res.json())
        .then(SetUser)
        .catch(() => {
          SetUser(null);
        });
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    fetch("api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then(SetUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    SetUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("UseAuth must be used with AuthProvider");
  }

  return ctx;
}
