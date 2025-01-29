import React from "react";
import Calendar from "@/components/Calendar";
import { Card, CardContent } from "@/components/ui/card";

interface CalendarSectionProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  onDateSelect?: () => void;
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({
  selectedDate,
  setSelectedDate,
  onDateSelect,
}) => {
  const handleDateSelect = () => {
    console.log("CalendarSection: Date selected, triggering data refresh");
    if (onDateSelect) {
      onDateSelect();
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex-grow flex items-center justify-center p-4">
        <Calendar 
          date={selectedDate} 
          setDate={setSelectedDate} 
          onDateSelect={handleDateSelect}
        />
      </CardContent>
    </Card>
  );
};