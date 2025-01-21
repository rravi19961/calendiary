import React from "react";
import { Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProfileAvatarProps {
  avatarUrl: string | null;
  username: string | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  avatarUrl,
  username,
  onImageUpload,
}) => {
  return (
    <div className="flex items-center space-x-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback>{username?.[0]?.toUpperCase() || "?"}</AvatarFallback>
      </Avatar>
      <div>
        <Input
          type="file"
          accept="image/*"
          className="hidden"
          id="avatar-upload"
          onChange={onImageUpload}
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
  );
};