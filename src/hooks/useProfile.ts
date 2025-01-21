import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Profile {
  username: string | null;
  avatar_url: string | null;
}

export const useProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile>({ username: null, avatar_url: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching profile for user:", user?.id);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", user?.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }

      if (data) {
        console.log("Profile data fetched:", data);
        setProfile(data);
      } else {
        console.log("No profile found, creating new profile");
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert([{ id: user?.id }])
          .select("username, avatar_url")
          .single();

        if (createError) throw createError;
        if (newProfile) setProfile(newProfile);
      }
    } catch (error) {
      console.error("Profile fetch/create error:", error);
      toast({
        title: "Error loading profile",
        description: "Please try refreshing the page",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { profile, isLoading };
};