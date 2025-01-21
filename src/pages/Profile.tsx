import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useProfileManager } from "@/hooks/useProfileManager";

const Profile = () => {
  const {
    profile,
    handleUpdateProfile,
    handleImageUpload,
    handleProfileChange,
  } = useProfileManager();

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
            <div className="space-y-6">
              <ProfileAvatar
                avatarUrl={profile.avatar_url}
                username={profile.username}
                onImageUpload={handleImageUpload}
              />
              <ProfileForm
                profile={profile}
                onProfileChange={handleProfileChange}
                onSubmit={handleUpdateProfile}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Profile;