import React from "react";
import { HeaderSection } from "@/components/diary/HeaderSection";
import { CalendarSection } from "@/components/home/CalendarSection";
import { EntryDisplay } from "@/components/diary/EntryDisplay";
import { ChatSection } from "@/components/home/ChatSection";
import { MoodTrendsSection } from "@/components/home/MoodTrendsSection";
import { PhotoGallerySection } from "@/components/diary/PhotoGallerySection";
import { DayHighlightsSection } from "@/components/home/DayHighlightsSection";
import EntryModal from "@/components/EntryModal";

interface MainLayoutProps {
  selectedDate: Date;
  currentQuoteIndex: number;
  onNewEntry: () => void;
  onDateChange: (date: Date) => void;
  entries: any[];
  currentEntryIndex: number;
  setCurrentEntryIndex: (index: number) => void;
  currentEntry: string;
  setCurrentEntry: (entry: string) => void;
  currentTitle: string;
  setCurrentTitle: (title: string) => void;
  currentRating: number;
  setCurrentRating: (rating: number) => void;
  onSave: () => void;
  isModalOpen: boolean;
  onCloseModal: () => void;
  modalKey: number;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  selectedDate,
  currentQuoteIndex,
  onNewEntry,
  onDateChange,
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
  isModalOpen,
  onCloseModal,
  modalKey,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6F2FA] to-white dark:from-gray-900 dark:to-gray-800">
      <HeaderSection 
        currentQuoteIndex={currentQuoteIndex}
        onNewEntry={onNewEntry}
      />

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

        <EntryModal
          key={modalKey}
          isOpen={isModalOpen}
          onClose={onCloseModal}
          date={selectedDate}
        />
      </main>
    </div>
  );
};