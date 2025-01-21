import React from "react";
import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ProfileFormData {
  username: string | null;
  full_name: string | null;
  date_of_birth: string | null;
  bio: string | null;
}

interface ProfileFormProps {
  profile: ProfileFormData;
  onProfileChange: (field: keyof ProfileFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onProfileChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="full_name" className={cn("text-sm font-medium", !profile.full_name && "text-destructive")}>
          Full Name *
        </Label>
        <Input
          id="full_name"
          value={profile.full_name || ""}
          onChange={(e) => onProfileChange("full_name", e.target.value)}
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
          onChange={(e) => onProfileChange("username", e.target.value)}
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
            onChange={(e) => onProfileChange("date_of_birth", e.target.value)}
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
          onChange={(e) => onProfileChange("bio", e.target.value)}
          placeholder="Tell us about yourself..."
          rows={4}
        />
      </div>

      <Button type="submit">Save Changes</Button>
    </form>
  );
};