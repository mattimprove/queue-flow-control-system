
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthContextType, User } from "@/types";

// This is a temporary auth implementation until we integrate with Supabase
const mockUser = {
  id: "1",
  usuario: "admin",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already authenticated
    const user = localStorage.getItem("queueUser");
    if (user) {
      setUser(JSON.parse(user));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Mock authentication - replace with Supabase auth later
      if (email === "admin@example.com" && password === "slingaoladodomeuresultado") {
        setUser(mockUser);
        localStorage.setItem("queueUser", JSON.stringify(mockUser));
        toast.success("Login successful");
        navigate("/dashboard");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Authentication error");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("queueUser");
    setUser(null);
    navigate("/login");
    toast.info("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
