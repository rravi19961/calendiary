import React from "react";
import { isToday } from "date-fns";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { DateNavigation } from "./DateNavigation";
import { EntryPagination } from "./EntryPagination";
import { EntryContent } from "./EntryContent";
import { EntryMaximizeModal } from "./EntryMaximizeModal";

interface Entry {
  id: string;
  title: string;
  content: string;
  rating: number;
  created_at: string;
}

interface EntryDisplayProps {
  entries: Entry[];
  currentEntryIndex: number;
  setCurrentEntryIndex: (index: number) => void;
  currentEntry: string;
  setCurrentEntry: (content: string) => void;
  currentTitle: string;
  setCurrentTitle: (title: string) => void;
  currentRating: number;
  setCurrentRating: (rating: number) => void;
  selectedDate: Date;
  onSave: () => void;
  onDateChange: (date: Date) => void;
}

export const EntryDisplay: React.FC<EntryDisplayProps> = ({
  entries,
  currentEntryIndex,
  setCurrentEntryIndex,
  currentEntry,
  setCurrentEntry,
  currentTitle,
  setCurrentTitle,
  currentRating,
  setCurrentRating,
  selectedDate,
  onSave,
  onDateChange,
}) => {
  const isCurrentDay = isToday(selectedDate);
  const currentDisplayEntry = entries[currentEntryIndex];
  const hasEntries = entries.length > 0;

  const handlePrevious = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    onDateChange(newDate);
  };

  React.useEffect(() => {
    if (currentDisplayEntry) {
      setCurrentEntry(currentDisplayEntry.content || "");
      setCurrentTitle(currentDisplayEntry.title || "");
      setCurrentRating(currentDisplayEntry.rating || 3);
    }
  }, [currentEntryIndex, currentDisplayEntry, setCurrentEntry, setCurrentTitle, setCurrentRating]);

  if (!hasEntries) {
    return (
      <Card className="h-full">
        <CardHeader>
          <DateNavigation
            selectedDate={selectedDate}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </CardHeader>
        <CardContent className="flex justify-center items-center h-full py-8">
          <p className="text-muted-foreground">No entries for this date</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col relative">
      <CardHeader>
        <DateNavigation
          selectedDate={selectedDate}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <EntryContent
          title={isCurrentDay ? currentTitle : currentDisplayEntry.title || ""}
          content={isCurrentDay ? currentEntry : currentDisplayEntry.content || ""}
          rating={isCurrentDay ? currentRating : currentDisplayEntry.rating || 3}
          isCurrentDay={isCurrentDay}
          onTitleChange={setCurrentTitle}
          onContentChange={setCurrentEntry}
          onRatingChange={setCurrentRating}
          onSave={onSave}
        />
        <EntryPagination
          currentIndex={currentEntryIndex}
          totalEntries={entries.length}
          onNavigate={setCurrentEntryIndex}
          className="mt-4"
        />
      </CardContent>
      <EntryMaximizeModal
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
      />
    </Card>
  );
};