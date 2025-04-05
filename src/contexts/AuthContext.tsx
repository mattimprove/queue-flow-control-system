
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthContextType, User } from "@/types";
import { supabase } from "@/integrations/supabase/client";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se existe uma sessão do Supabase e configura o usuário
    const checkSession = async () => {
      setIsLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Erro ao verificar sessão:", error.message);
      }
      
      if (session?.user) {
        const userData: User = {
          id: session.user.id,
          usuario: session.user.email || session.user.user_metadata?.usuario || "usuário",
        };
        setUser(userData);
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    };

    // Verifica a sessão ao carregar
    checkSession();

    // Configura listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            usuario: session.user.email || session.user.user_metadata?.usuario || "usuário",
          };
          setUser(userData);
          localStorage.setItem("queueUser", JSON.stringify(userData));
        } else {
          setUser(null);
          localStorage.removeItem("queueUser");
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Erro ao fazer login");
        return;
      }

      if (data.user) {
        const userData: User = {
          id: data.user.id,
          usuario: data.user.email || data.user.user_metadata?.usuario || "usuário",
        };
        setUser(userData);
        localStorage.setItem("queueUser", JSON.stringify(userData));
        toast.success("Login realizado com sucesso");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Erro de login:", error);
      toast.error("Erro de autenticação");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("queueUser");
      setUser(null);
      navigate("/login");
      toast.info("Logout realizado com sucesso");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout");
    }
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
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
