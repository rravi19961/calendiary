import React from "react";
import { format, addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DateNavigationProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export const DateNavigation: React.FC<DateNavigationProps> = ({
  date,
  onDateChange,
}) => {
  const handlePreviousDay = () => {
    onDateChange(subDays(date, 1));
  };

  const handleNextDay = () => {
    onDateChange(addDays(date, 1));
  };

  return (
    <div className="flex items-center justify-between w-full mb-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePreviousDay}
        className="hover:bg-accent"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <h2 className="text-xl font-semibold">
        {format(date, "MMMM d, yyyy")}
      </h2>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleNextDay}
        className="hover:bg-accent"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};