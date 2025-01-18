import React from "react";
import Calendar from "@/components/Calendar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <h2 className="text-2xl font-bold text-calendiary-primary text-left">Calendar</h2>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center p-4">
        <Calendar 
          date={selectedDate} 
          setDate={setSelectedDate} 
          onDateSelect={onDateSelect}
        />
      </CardContent>
    </Card>
  );
};