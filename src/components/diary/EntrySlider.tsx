import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EntryForm } from "./EntryForm";
import { Entry } from "./useEntries";

interface EntrySliderProps {
  entries: Entry[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  disabled?: boolean;
  onChange: (changes: { content?: string; rating?: number }, entryId: string) => void;
}

export const EntrySlider = ({ 
  entries, 
  currentIndex, 
  setCurrentIndex, 
  disabled,
  onChange 
}: EntrySliderProps) => {
  const handlePrevious = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex(Math.min(entries.length - 1, currentIndex + 1));
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="absolute left-0 z-10"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="w-full overflow-hidden px-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <EntryForm
                content={entries[currentIndex].content}
                rating={entries[currentIndex].rating}
                disabled={disabled}
                onChange={(changes) => onChange(changes, entries[currentIndex].id)}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          disabled={currentIndex === entries.length - 1}
          className="absolute right-0 z-10"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex justify-center gap-1 mt-4">
        {entries.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-primary" : "bg-primary/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
};