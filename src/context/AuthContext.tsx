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
        // First, check for an existing session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setUser(null);
          return;
        }

        // Set initial user state
        if (session?.user) {
          setUser(session.user);
          console.log("Initial session user:", session.user);
        }

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
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            navigate("/login");
          } else if (event === 'TOKEN_REFRESHED') {
            if (session?.user) {
              setUser(session.user);
              console.log("Token refreshed for user:", session.user);
            }
          } else if (event === 'USER_UPDATED') {
            if (session?.user) {
              setUser(session.user);
            }
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
  }, [toast, navigate]);

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