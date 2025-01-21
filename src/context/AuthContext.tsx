import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthError, AuthApiError } from "@supabase/supabase-js";
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

const getErrorMessage = (error: AuthError) => {
  if (error instanceof AuthApiError) {
    switch (error.status) {
      case 400:
        if (error.message.includes("Invalid login credentials")) {
          return "Invalid email or password. Please check your credentials and try again.";
        }
        return "Login failed. Please check your credentials and try again.";
      case 422:
        return "Invalid email format. Please enter a valid email address.";
      case 429:
        return "Too many login attempts. Please try again later.";
      default:
        return error.message;
    }
  }
  return "An unexpected error occurred. Please try again.";
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          toast({
            title: "Authentication Error",
            description: getErrorMessage(sessionError),
            variant: "destructive",
          });
          setUser(null);
          navigate("/login");
          return;
        }

        // Set initial user state
        if (session?.user) {
          setUser(session.user);
          console.log("Initial session user:", session.user);
        } else {
          navigate("/login");
        }

        // Set up auth state change listener
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log("Auth event:", event);
          
          if (session?.user) {
            setUser(session.user);
            if (event === 'SIGNED_IN') {
              navigate("/");
              toast({
                title: "Welcome back!",
                description: "You have successfully logged in.",
              });
            }
          } else {
            setUser(null);
            if (event === 'SIGNED_OUT') {
              navigate("/login");
            } else if (event === 'TOKEN_REFRESHED') {
              toast({
                title: "Session Expired",
                description: "Please log in again.",
                variant: "destructive",
              });
              navigate("/login");
            }
          }
        });

        return () => {
          subscription.unsubscribe();
        };

      } catch (error) {
        console.error("Auth initialization error:", error);
        if (error instanceof AuthError) {
          toast({
            title: "Authentication Error",
            description: getErrorMessage(error),
            variant: "destructive",
          });
        }
        setUser(null);
        navigate("/login");
      }
    };

    initializeAuth();
  }, [toast, navigate]);

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      navigate("/login");
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      if (error instanceof AuthError) {
        toast({
          title: "Error",
          description: getErrorMessage(error),
          variant: "destructive",
        });
      }
      // Still clear local state and redirect even if there's an error
      setUser(null);
      navigate("/login");
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