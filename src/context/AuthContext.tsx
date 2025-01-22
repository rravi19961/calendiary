import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        // Set up real-time subscription to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (_event, session) => {
            console.log("Auth state changed:", _event, session?.user);
            setUser(session?.user ?? null);
            
            if (session?.user) {
              // Successful authentication
              navigate("/");
              toast({
                title: "Welcome back!",
                description: "You've been successfully logged in.",
              });
            } else {
              // User is logged out
              navigate("/login");
            }
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth error:', error);
        toast({
          title: "Authentication Error",
          description: "Please try logging in again",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [navigate, toast]);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate("/login");
      toast({
        title: "Logged out successfully",
        description: "See you next time!",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error logging out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const updateUser = (data: Partial<User>) => {
    setUser(prev => (prev ? { ...prev, ...data } : null));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};