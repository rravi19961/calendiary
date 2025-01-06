import React from "react";
import Calendar from "@/components/Calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CalendarSectionProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({
  selectedDate,
  setSelectedDate,
}) => {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Calendar</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar date={selectedDate} setDate={setSelectedDate} />
      </CardContent>
    </Card>
  );
};