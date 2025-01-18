import React from "react";
import { format } from "date-fns";
import { QUOTES } from "./constants";

interface HeaderSectionProps {
  currentQuoteIndex: number;
  selectedDate?: Date;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({ 
  currentQuoteIndex,
  selectedDate = new Date()
}) => {
  return (
    <header className="py-6 px-4 text-center">
      <h1 className="text-2xl font-bold text-calendiary-primary text-left mb-4">
        {format(selectedDate, "MMMM d, yyyy")}
      </h1>
      <p className="text-lg text-calendiary-primary/80 italic animate-fadeIn">
        {QUOTES[currentQuoteIndex]}
      </p>
    </header>
  );
};