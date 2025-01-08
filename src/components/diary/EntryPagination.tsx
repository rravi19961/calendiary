import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EntryPaginationProps {
  currentIndex: number;
  totalEntries: number;
  onNavigate: (index: number) => void;
  className?: string;
}

export const EntryPagination: React.FC<EntryPaginationProps> = ({
  currentIndex,
  totalEntries,
  onNavigate,
  className = "",
}) => {
  if (totalEntries <= 1) return null;

  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onNavigate(Math.max(0, currentIndex - 1))}
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm text-muted-foreground">
        {currentIndex + 1} of {totalEntries}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onNavigate(Math.min(totalEntries - 1, currentIndex + 1))}
        disabled={currentIndex === totalEntries - 1}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};