import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Profile {
  username: string | null;
  avatar_url: string | null;
  full_name: string | null;
  date_of_birth: string | null;
  bio: string | null;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = React.useState<Profile>({
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
      const { data, error } = await supabase
        .from("profiles")
        .select("username, avatar_url, full_name, date_of_birth, bio")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
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

  return (
    <div className="container max-w-4xl py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback>
                    {profile.username?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="avatar-upload"
                    onChange={handleImageUpload}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("avatar-upload")?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Picture
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_name" className={cn("text-sm font-medium", !profile.full_name && "text-destructive")}>
                  Full Name *
                </Label>
                <Input
                  id="full_name"
                  value={profile.full_name || ""}
                  onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  value={profile.username || ""}
                  onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth" className={cn("text-sm font-medium", !profile.date_of_birth && "text-destructive")}>
                  Date of Birth *
                </Label>
                <div className="relative">
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={profile.date_of_birth || ""}
                    onChange={(e) => setProfile(prev => ({ ...prev, date_of_birth: e.target.value }))}
                    required
                  />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={profile.bio || ""}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>

              <Button type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Profile;
