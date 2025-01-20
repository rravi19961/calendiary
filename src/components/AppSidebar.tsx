import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarProfile } from "./sidebar/SidebarProfile";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Profile {
  username: string | null;
  avatar_url: string | null;
}

export function AppSidebar() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { toast } = useToast();
  const { state } = useSidebar();
  const [profile, setProfile] = useState<Profile>({ username: null, avatar_url: null });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data: existingProfile, error: checkError } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", user?.id)
        .single();

      if (checkError) {
        if (checkError.code === 'PGRST116') {
          const { data: newProfile, error: insertError } = await supabase
            .from("profiles")
            .insert([{ id: user?.id }])
            .select("username, avatar_url")
            .single();

          if (insertError) throw insertError;
          if (newProfile) setProfile(newProfile);
        } else {
          throw checkError;
        }
      } else if (existingProfile) {
        setProfile(existingProfile);
      }
    } catch (error) {
      console.error("Error fetching/creating profile:", error);
      toast({
        title: "Error loading profile",
        description: "Please try refreshing the page",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
      toast({
        title: "Logged out successfully",
        description: "See you next time!",
      });
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader />
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarProfile profile={profile} userEmail={user?.email} />
          <SidebarGroupContent>
            <SidebarNavigation />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className={cn(
                  "w-full py-3 text-base bg-calendiary-primary hover:bg-calendiary-hover",
                  state === "collapsed" && "w-10 h-10 p-0"
                )}
              >
                <LogOut className="h-5 w-5" />
                {state !== "collapsed" && <span className="ml-2">Logout</span>}
              </Button>
            </TooltipTrigger>
            {state === "collapsed" && (
              <TooltipContent side="right">
                <p>Logout</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </SidebarFooter>
    </Sidebar>
  );
}