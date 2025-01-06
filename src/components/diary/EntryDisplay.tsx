import React from "react";
import { format, isToday } from "date-fns";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { EntryNavigation } from "./EntryNavigation";
import { EntryContent } from "./EntryContent";

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
}) => {
  const isCurrentDay = isToday(selectedDate);
  const currentDisplayEntry = entries[currentEntryIndex];
  const hasEntries = entries.length > 0;

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
        <CardContent className="flex justify-center items-center h-full py-8">
          <p className="text-muted-foreground">No entries for this date</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {isCurrentDay ? "Today's Entry" : format(selectedDate, "MMMM d, yyyy")}
          </h2>
          <EntryNavigation
            entriesCount={entries.length}
            currentIndex={currentEntryIndex}
            onNavigate={setCurrentEntryIndex}
          />
        </div>
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
      </CardContent>
    </Card>
  );
};