import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

interface Profile {
  username: string | null;
  avatar_url: string | null;
}

interface SidebarProfileProps {
  profile: Profile;
  userEmail?: string | null;
}

export function SidebarProfile({ profile, userEmail }: SidebarProfileProps) {
  const { state } = useSidebar();
  
  return (
    <div className="mt-6 flex flex-col items-center space-y-2">
      <Avatar className={cn(
        "transition-all duration-200",
        state === "collapsed" ? "h-8 w-8" : "h-16 w-16"
      )}>
        <AvatarImage src={profile.avatar_url || undefined} />
        <AvatarFallback>
          {profile.username?.[0]?.toUpperCase() || userEmail?.[0]?.toUpperCase() || "?"}
        </AvatarFallback>
      </Avatar>
      {state !== "collapsed" && (
        <p className="text-sm font-medium text-foreground">
          {profile.username || userEmail?.split("@")[0] || "User"}
        </p>
      )}
    </div>
  );
}