import React from "react";
import { format, isToday } from "date-fns";
import { Smile, Meh, Frown } from "lucide-react";
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
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold">
            {format(selectedDate, "MMMM d, yyyy")}
          </h2>
          {currentDisplayEntry && getMoodIcon(currentDisplayEntry.rating)}
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setCurrentEntryIndex(Math.max(0, currentEntryIndex - 1))}
            disabled={currentEntryIndex === 0}
          >
            ←
          </Button>
          <span className="text-sm text-muted-foreground">
            {entries.length > 0 ? `${currentEntryIndex + 1} of ${entries.length}` : "No entries"}
          </span>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setCurrentEntryIndex(Math.min(entries.length - 1, currentEntryIndex + 1))}
            disabled={currentEntryIndex === entries.length - 1}
          >
            →
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentDisplayEntry ? (
          <>
            <Input
              value={currentDisplayEntry.title}
              readOnly={!isCurrentDay}
              className="font-semibold"
            />
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
                  Save Changes
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No entries for this date
          </div>
        )}
      </CardContent>
    </Card>
  );
};