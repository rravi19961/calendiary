import React from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarProfile } from "./sidebar/SidebarProfile";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { LogoutButton } from "./sidebar/LogoutButton";
import { useProfile } from "@/hooks/useProfile";

interface AppSidebarProps {
  onNewEntry: () => void;
}

export function AppSidebar({ onNewEntry }: AppSidebarProps) {
  const { user } = useAuth();
  const { profile, isLoading } = useProfile();

  return (
    <Sidebar className="border-r">
      <SidebarHeader />
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarProfile 
            profile={profile} 
            userEmail={user?.email} 
            onNewEntry={onNewEntry}
            isLoading={isLoading}
          />
          <SidebarGroupContent className="mt-6">
            <SidebarNavigation />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  );
}