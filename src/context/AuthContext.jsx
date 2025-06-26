import { createContext, useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      api
        .get("/auth/verify", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setCurrentUser(res.data);
        })
        .catch(() => {
          localStorage.removeItem("authToken");
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const res = await api.post("/auth/login", credentials);
    localStorage.setItem("authToken", res.data.authToken);
    const verify = await api.get("/auth/verify", {
      headers: { Authorization: `Bearer ${res.data.authToken}` },
    });
    setCurrentUser(verify.data);
    nav("/");
  };

  const signup = async (data) => {
    await api.post("/auth/signup", data);
    await login({ email: data.email, password: data.password });
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setCurrentUser(null);
    nav("/login");
  };

  const updateUser = (updatedData) => {
    setCurrentUser((prev) => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        signup,
        logout,
        isLoading,
        updateUser, // novo valor disponível no contexto
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
