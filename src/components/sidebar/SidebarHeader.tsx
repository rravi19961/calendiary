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
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="absolute -left-3 top-4 z-50 h-6 w-6 rounded-full bg-white shadow-md hover:bg-gray-100"
      >
        <Menu className="h-4 w-4" />
      </Button>
      <div className={cn(
        "flex items-center justify-center transition-all duration-200",
        state === "collapsed" ? "p-2" : "p-4"
      )}>
        <button 
          onClick={() => navigate("/")}
          className="w-full hover:opacity-80 transition-opacity"
        >
          <img 
            src="/lovable-uploads/02591592-bfe3-4424-b997-ae6fbecba899.png" 
            alt="Calendiary Logo" 
            className={cn(
              "transition-all duration-200",
              state === "collapsed" ? "h-8" : "h-12 w-full object-contain"
            )}
          />
        </button>
      </div>
    </div>
  );
}