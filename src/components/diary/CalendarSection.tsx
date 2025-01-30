import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface CalendarSectionProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const handleToday = () => {
    onDateChange(new Date());
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Calendar</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button
          variant="default"
          className="w-full bg-[#1E2A4A] hover:bg-[#2A3B66] text-white"
          onClick={handleToday}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          Today
        </Button>
        
        <div className="rounded-lg border bg-card text-card-foreground">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onDateChange(date)}
            className="w-full"
            showOutsideDays={false}
            disabled={(date) => date > new Date()}
          />
        </div>
      </CardContent>
    </Card>
  );
};