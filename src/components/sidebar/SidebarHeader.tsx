import React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

export function SidebarHeader() {
  const { toggleSidebar, state } = useSidebar();
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-between p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hover:bg-transparent"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <button 
        onClick={() => navigate("/")}
        className={cn(
          "w-full flex justify-center items-center hover:opacity-80 transition-opacity",
          state === "collapsed" ? "px-2" : "px-4"
        )}
      >
        <img 
          src="/lovable-uploads/02591592-bfe3-4424-b997-ae6fbecba899.png" 
          alt="Calendiary Logo" 
          className="h-12 w-auto"
        />
      </button>
    </>
  );
}