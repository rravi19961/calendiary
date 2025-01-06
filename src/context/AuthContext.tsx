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

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          setUser(null);
          return;
        }

        setUser(session?.user ?? null);

        // Listen for auth changes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log("Auth event:", event);
          
          if (event === 'SIGNED_IN' && session?.user) {
            setUser(session.user);
            toast({
              title: "Welcome back!",
              description: "You have successfully logged in.",
            });
          } else if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
            // Handle sign out or token refresh
            setUser(session?.user ?? null);
          } else if (event === 'USER_UPDATED') {
            // Handle user update
            setUser(session?.user ?? null);
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Auth initialization error:", error);
        setUser(null);
      }
    };

    initializeAuth();
  }, [toast]);

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear the user state
      setUser(null);
      
      // Navigate to login page
      navigate("/login");

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local state and redirect even if there's an error
      setUser(null);
      navigate("/login");
      toast({
        title: "Logged out",
        description: "You have been logged out.",
      });
    }
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

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