import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  username: string | null;
  avatar_url: string | null;
  full_name: string | null;
  date_of_birth: string | null;
  bio: string | null;
}

export const useProfileManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile>({
    username: "",
    avatar_url: null,
    full_name: null,
    date_of_birth: null,
    bio: null,
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      console.log("Fetching profile for user:", user?.id);
      const { data, error } = await supabase
        .from("profiles")
        .select("username, avatar_url, full_name, date_of_birth, bio")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      if (data) {
        console.log("Profile data fetched:", data);
        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error loading profile",
        description: "Please try refreshing the page",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Updating profile for user:", user?.id);
      const { error } = await supabase
        .from("profiles")
        .update({
          username: profile.username,
          full_name: profile.full_name,
          date_of_birth: profile.date_of_birth,
          bio: profile.bio,
        })
        .eq("id", user?.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        console.log("Uploading image for user:", user?.id);
        const fileExt = file.name.split(".").pop();
        const filePath = `${user?.id}/${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { error: updateError } = await supabase
          .from("profiles")
          .update({ avatar_url: filePath })
          .eq("id", user?.id);

        if (updateError) throw updateError;

        setProfile(prev => ({ ...prev, avatar_url: filePath }));

        toast({
          title: "Image uploaded",
          description: "Your profile picture has been updated.",
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive",
        });
      }
    }
  };

  const handleProfileChange = (field: keyof Profile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return {
    profile,
    handleUpdateProfile,
    handleImageUpload,
    handleProfileChange,
  };
};