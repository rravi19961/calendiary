import React from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface CalendarProps {
  date: Date;
  setDate: (date: Date) => void;
  onDateSelect?: () => void;  // Added this optional prop
}

const Calendar: React.FC<CalendarProps> = ({ date, setDate, onDateSelect }) => {
  const handleSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      onDateSelect?.();  // Call onDateSelect if it exists
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="neo-card p-6 w-full max-w-sm mx-auto"
    >
      <div className="flex items-center space-x-2 mb-4">
        <CalendarIcon className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Select Date</h2>
      </div>
      <CalendarComponent
        mode="single"
        selected={date}
        onSelect={handleSelect}
        className="rounded-md border shadow"
      />
    </motion.div>
  );
};

export default Calendar;