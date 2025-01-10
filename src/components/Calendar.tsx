import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { isFuture, startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";

interface CalendarProps {
  date: Date;
  setDate: (date: Date) => void;
  onDateSelect?: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ date, setDate, onDateSelect }) => {
  const handleSelect = (newDate: Date | undefined) => {
    if (newDate) {
      const selectedDate = startOfDay(newDate);
      setDate(selectedDate);
      
      if (onDateSelect && !isFuture(selectedDate)) {
        console.log(`Date selected: ${selectedDate}`);
        onDateSelect();
      }
    }
  };

  const goToToday = () => {
    const today = startOfDay(new Date());
    setDate(today);
    if (onDateSelect && !isFuture(today)) {
      console.log("Going to today's date");
      onDateSelect();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      <Button 
        variant="outline" 
        onClick={goToToday}
        className="w-[240px] rounded-md h-10 transition-all hover:scale-105"
      >
        <CalendarIcon className="h-4 w-4 mr-2" />
        Today
      </Button>
      
      <div className="flex justify-center w-full">
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={handleSelect}
          disabled={(date) => isFuture(date)}
          className="rounded-md border shadow-sm w-full max-w-[320px]"
        />
      </div>
    </div>
  );
};

export default Calendar;