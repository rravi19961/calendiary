import React from "react";
import { CalendarSection } from "./CalendarSection";
import { ChatSection } from "./ChatSection";
import { DayHighlightsSection } from "./DayHighlightsSection";
import { MoodTrendsSection } from "./MoodTrendsSection";
import { PhotoGallerySection } from "@/components/diary/PhotoGallerySection";
import { EntryDisplay } from "@/components/diary/EntryDisplay";

interface MainContentProps {
  selectedDate: Date;
  entries: any[];
  currentEntryIndex: number;
  setCurrentEntryIndex: (index: number) => void;
  currentEntry: string;
  setCurrentEntry: (content: string) => void;
  currentTitle: string;
  setCurrentTitle: (title: string) => void;
  currentRating: number;
  setCurrentRating: (rating: number) => void;
  onSave: () => void;
  onDateChange: (date: Date) => void;
}

export const MainContent: React.FC<MainContentProps> = ({
  selectedDate,
  entries,
  currentEntryIndex,
  setCurrentEntryIndex,
  currentEntry,
  setCurrentEntry,
  currentTitle,
  setCurrentTitle,
  currentRating,
  setCurrentRating,
  onSave,
  onDateChange,
}) => {
  return (
    <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-[600px]">
          <CalendarSection 
            selectedDate={selectedDate}
            setSelectedDate={onDateChange}
            onDateSelect={() => onDateChange(selectedDate)}
          />
        </div>

        <div className="h-[600px]">
          <EntryDisplay
            entries={entries}
            currentEntryIndex={currentEntryIndex}
            setCurrentEntryIndex={setCurrentEntryIndex}
            currentEntry={currentEntry}
            setCurrentEntry={setCurrentEntry}
            currentTitle={currentTitle}
            setCurrentTitle={setCurrentTitle}
            currentRating={currentRating}
            setCurrentRating={setCurrentRating}
            selectedDate={selectedDate}
            onSave={onSave}
            onDateChange={onDateChange}
          />
        </div>

        <div className="h-[600px]">
          <ChatSection selectedDate={selectedDate} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-[400px]">
          <MoodTrendsSection />
        </div>
        <div className="h-[400px]">
          <PhotoGallerySection selectedDate={selectedDate} />
        </div>
      </div>

      <div className="w-full">
        <DayHighlightsSection selectedDate={selectedDate} />
      </div>
    </main>
  );
};