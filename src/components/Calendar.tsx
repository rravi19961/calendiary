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
    if (onDateSelect) {
      onDateSelect();
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      <Button 
        variant="outline" 
        onClick={goToToday}
        className="w-full rounded-md h-10"
      >
        <CalendarIcon className="h-4 w-4 mr-2" />
        Today
      </Button>
      
      <CalendarComponent
        mode="single"
        selected={date}
        onSelect={handleSelect}
        disabled={(date) => isFuture(date)}
        className="rounded-md border shadow-sm w-full h-[350px]"
      />
    </div>
  );
};

export default Calendar;