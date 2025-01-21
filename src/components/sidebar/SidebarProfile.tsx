import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Profile {
  username: string | null;
  avatar_url: string | null;
}

interface SidebarProfileProps {
  profile: Profile;
  userEmail?: string | null;
  onNewEntry: () => void;
  isLoading?: boolean;
}

export function SidebarProfile({ profile, userEmail, onNewEntry, isLoading = false }: SidebarProfileProps) {
  const { state } = useSidebar();
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center space-y-6">
        <div className="flex flex-col items-center space-y-3">
          <Skeleton className={cn(
            "rounded-full",
            state === "collapsed" ? "h-10 w-10" : "h-20 w-20"
          )} />
          {state !== "collapsed" && (
            <Skeleton className="h-4 w-24" />
          )}
        </div>
        <Skeleton className={cn(
          "aspect-square",
          state === "collapsed" ? "w-10 h-10" : "w-full h-12"
        )} />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex flex-col items-center space-y-3">
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
          <p className="text-lg font-medium text-foreground">
            {profile.username || userEmail?.split("@")[0] || "User"}
          </p>
        )}
      </div>

      <Button
        onClick={onNewEntry}
        className={cn(
          "aspect-square w-full bg-[#242d58] hover:bg-[#1e254b] text-white font-bold rounded-lg transition-all",
          state === "collapsed" ? "w-10 h-10 p-0" : "p-8"
        )}
      >
        <Plus className={cn("h-6 w-6", state !== "collapsed" && "mr-2")} />
        {state !== "collapsed" && <span>New Entry</span>}
      </Button>
    </div>
  );
}