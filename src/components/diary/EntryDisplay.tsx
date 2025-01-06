import React from "react";
import { format, isToday } from "date-fns";
import { Smile, Meh, Frown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

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

const MoodSelector = ({ rating, onChange, disabled }: { rating: number; onChange: (rating: number) => void; disabled: boolean }) => {
  const moods = [
    { icon: Frown, value: 1, label: "Very Sad" },
    { icon: Frown, value: 2, label: "Sad" },
    { icon: Meh, value: 3, label: "Neutral" },
    { icon: Smile, value: 4, label: "Happy" },
    { icon: Smile, value: 5, label: "Very Happy" },
  ];

  return (
    <div className="flex justify-center gap-2">
      {moods.map(({ icon: Icon, value, label }) => (
        <button
          key={value}
          onClick={() => !disabled && onChange(value)}
          disabled={disabled}
          className={`p-2 rounded-lg transition-all ${
            rating === value
              ? "bg-primary text-primary-foreground scale-110"
              : "hover:bg-secondary"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          title={label}
        >
          <Icon className="h-5 w-5" />
        </button>
      ))}
    </div>
  );
};

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
          {entries.length > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentEntryIndex(Math.max(0, currentEntryIndex - 1))}
                disabled={currentEntryIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentEntryIndex(Math.min(entries.length - 1, currentEntryIndex + 1))}
                disabled={currentEntryIndex === entries.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <Input
          value={isCurrentDay ? currentTitle : currentDisplayEntry.title}
          onChange={(e) => isCurrentDay && setCurrentTitle(e.target.value)}
          readOnly={!isCurrentDay}
          className="font-semibold"
          placeholder="Entry Title"
        />
      </CardHeader>
      <CardContent className="flex-grow flex flex-col space-y-6">
        <Textarea
          value={isCurrentDay ? currentEntry : currentDisplayEntry.content}
          onChange={(e) => isCurrentDay && setCurrentEntry(e.target.value)}
          placeholder="Write about your day..."
          className="flex-grow min-h-[200px]"
          readOnly={!isCurrentDay}
        />
        <div className="space-y-4">
          <MoodSelector
            rating={isCurrentDay ? currentRating : currentDisplayEntry.rating}
            onChange={setCurrentRating}
            disabled={!isCurrentDay}
          />
          {isCurrentDay && (
            <Button onClick={onSave} className="w-full">
              Save Entry
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};