import React from "react";
import { Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

interface Profile {
  username: string | null;
  avatar_url: string | null;
}

interface SidebarProfileProps {
  profile: Profile;
  userEmail?: string | null;
  onNewEntry?: () => void;
}

export function SidebarProfile({ profile, userEmail, onNewEntry }: SidebarProfileProps) {
  const { state } = useSidebar();
  
  return (
    <div className="mt-6 flex flex-col items-center space-y-3">
      <Avatar className={cn(
        "transition-all duration-200",
        state === "collapsed" ? "h-10 w-10" : "h-20 w-20"
      )}>
        <AvatarImage src={profile.avatar_url || undefined} />
        <AvatarFallback className="text-lg">
          {profile.username?.[0]?.toUpperCase() || userEmail?.[0]?.toUpperCase() || "?"}
        </AvatarFallback>
      </Avatar>
      {state !== "collapsed" && (
        <>
          <p className="text-lg font-medium text-[#242d58]">
            {profile.username || userEmail?.split("@")[0] || "User"}
          </p>
          <Button
            onClick={onNewEntry}
            className="w-full bg-[#242d58] hover:bg-[#1e274f] text-lg font-semibold py-6"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Entry
          </Button>
        </>
      )}
    </div>
  );
}