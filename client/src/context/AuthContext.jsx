import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage when app starts
  useEffect(() => {
    const storedUser = localStorage.getItem("ccUser");

    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("ccUser");
      }
    }

    setLoading(false);
  }, []);

  // Login
  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    console.log("Login Response:", response.data);

    localStorage.setItem("ccUser", JSON.stringify(response.data));

    setUser(response.data);

    return response.data;
  };

  // Register
  const register = async (name, email, password, role) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
      role,
    });

    console.log("Register Response:", response.data);

    localStorage.setItem("ccUser", JSON.stringify(response.data));

    setUser(response.data);

    return response.data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("ccUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
