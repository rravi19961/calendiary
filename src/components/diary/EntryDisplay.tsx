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
  selectedDate: Date;
  onSave: () => void;
}

const getMoodIcon = (rating: number) => {
  if (rating <= 2) return <Frown className="h-5 w-5 text-red-500" />;
  if (rating === 3) return <Meh className="h-5 w-5 text-yellow-500" />;
  return <Smile className="h-5 w-5 text-green-500" />;
};

export const EntryDisplay: React.FC<EntryDisplayProps> = ({
  entries,
  currentEntryIndex,
  setCurrentEntryIndex,
  currentEntry,
  setCurrentEntry,
  selectedDate,
  onSave,
}) => {
  const isCurrentDay = isToday(selectedDate);
  const currentDisplayEntry = entries[currentEntryIndex];

  return (
    <Card className="glass">
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {isCurrentDay ? "Today's Entry" : format(selectedDate, "MMMM d, yyyy")}
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentEntryIndex(Math.max(0, currentEntryIndex - 1))}
              disabled={currentEntryIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {entries.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {currentEntryIndex + 1} of {entries.length}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentEntryIndex(Math.min(entries.length - 1, currentEntryIndex + 1))}
              disabled={currentEntryIndex === entries.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {currentDisplayEntry && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getMoodIcon(currentDisplayEntry.rating)}
              <Input
                value={currentDisplayEntry.title}
                readOnly={!isCurrentDay}
                className="font-semibold max-w-[300px]"
                placeholder="Entry Title"
              />
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {currentDisplayEntry ? (
          <div className="space-y-4">
            <Textarea
              value={isCurrentDay ? currentEntry : currentDisplayEntry.content}
              onChange={(e) => isCurrentDay && setCurrentEntry(e.target.value)}
              placeholder="Write about your day..."
              className="min-h-[200px]"
              readOnly={!isCurrentDay}
            />
            {isCurrentDay && (
              <div className="flex justify-end">
                <Button onClick={onSave}>
                  Save Entry
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center items-center py-8">
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};