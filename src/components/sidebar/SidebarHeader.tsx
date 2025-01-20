import React from "react";
import { ChevronLeft } from "lucide-react";
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
        className="absolute -right-3 top-4 z-50 h-8 w-8 rounded-full bg-white shadow-md hover:bg-gray-100 transition-transform duration-200"
        style={{
          transform: state === "collapsed" ? "rotate(180deg)" : "rotate(0deg)",
        }}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className={cn(
        "flex items-center justify-center transition-all duration-200 bg-calendiary-primary",
        state === "collapsed" ? "p-2" : "p-8"
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
              state === "collapsed" ? "h-8" : "h-24 w-full object-contain"
            )}
          />
        </button>
      </div>
    </div>
  );
}