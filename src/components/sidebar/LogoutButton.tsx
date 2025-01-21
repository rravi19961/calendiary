import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const LogoutButton = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();
  const { state } = useSidebar();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
      toast({
        title: "Logged out successfully",
        description: "See you next time!",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error logging out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
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
  );
};