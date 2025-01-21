import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { isFuture, startOfDay, startOfMonth } from "date-fns";
import { Button } from "@/components/ui/button";

interface CalendarProps {
  date: Date;
  setDate: (date: Date) => void;
  onDateSelect?: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ date, setDate, onDateSelect }) => {
  const [month, setMonth] = React.useState<Date>(startOfMonth(date));

  const handleSelect = (newDate: Date | undefined) => {
    if (newDate) {
      const selectedDate = startOfDay(newDate);
      if (!isFuture(selectedDate)) {
        console.log("Calendar: Selected date:", selectedDate);
        setDate(selectedDate);
        setMonth(startOfMonth(selectedDate));
        
        if (onDateSelect) {
          console.log("Calendar: Triggering onDateSelect");
          onDateSelect();
        }
      } else {
        console.log("Calendar: Cannot select future date");
      }
    }
  };

  const goToToday = () => {
    const today = startOfDay(new Date());
    console.log("Calendar: Going to today:", today);
    setDate(today);
    setMonth(startOfMonth(today));
    
    if (onDateSelect) {
      console.log("Calendar: Triggering onDateSelect for today");
      onDateSelect();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      <Button 
        variant="default"
        onClick={goToToday}
        className="w-[240px] rounded-md h-10 transition-all hover:scale-105 bg-calendiary-primary hover:bg-calendiary-hover"
      >
        <CalendarIcon className="h-4 w-4 mr-2" />
        Today
      </Button>
      
      <div className="flex justify-center w-full">
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={handleSelect}
          month={month}
          onMonthChange={setMonth}
          disabled={(date) => isFuture(date)}
          className="rounded-md border shadow-sm w-full max-w-[320px] transition-all hover:shadow-md"
          classNames={{
            day: "transition-colors hover:bg-muted/50 focus:bg-muted cursor-pointer",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90",
            day_today: "bg-accent text-accent-foreground",
            day_disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
          }}
        />
      </div>
    </div>
  );
};

export default Calendar;