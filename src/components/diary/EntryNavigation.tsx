import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EntryNavigationProps {
  entriesCount: number;
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export const EntryNavigation: React.FC<EntryNavigationProps> = ({
  entriesCount,
  currentIndex,
  onNavigate,
}) => {
  if (entriesCount <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onNavigate(Math.max(0, currentIndex - 1))}
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onNavigate(Math.min(entriesCount - 1, currentIndex + 1))}
        disabled={currentIndex === entriesCount - 1}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};