import React, { useState } from "react";
import { format } from "date-fns";
import { Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { EntryContent } from "./EntryContent";

interface Entry {
  id: string;
  title: string;
  content: string;
  rating: number;
  created_at: string;
}

interface EntryMaximizeModalProps {
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

export const EntryMaximizeModal: React.FC<EntryMaximizeModalProps> = ({
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
  const [isOpen, setIsOpen] = useState(false);
  const isCurrentDay = format(new Date(), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute top-4 right-4">
          <Maximize2 className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[100vw] p-0 gap-0"
      >
        <div className="h-full flex flex-col sm:flex-row">
          {/* Left Panel - Entry Titles */}
          <div className="w-full sm:w-1/3 border-r bg-muted/20">
            <SheetHeader className="p-6 border-b">
              <SheetTitle>
                Entries for {format(selectedDate, "MMMM d, yyyy")}
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-5rem)]">
              <div className="p-4 space-y-2">
                {entries.map((entry, index) => (
                  <div key={entry.id}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        index === currentEntryIndex && "bg-muted"
                      )}
                      onClick={() => setCurrentEntryIndex(index)}
                    >
                      {entry.title || "Untitled Entry"}
                    </Button>
                    <Separator className="my-2" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel - Entry Content */}
          <div className="flex-1 h-full flex flex-col">
            <SheetHeader className="p-6 border-b">
              <div className="flex justify-between items-center">
                <SheetTitle>
                  {entries[currentEntryIndex]?.title || "Untitled Entry"}
                </SheetTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </SheetHeader>
            <ScrollArea className="flex-1 p-6">
              <EntryContent
                title={currentTitle}
                content={currentEntry}
                rating={currentRating}
                isCurrentDay={isCurrentDay}
                onTitleChange={setCurrentTitle}
                onContentChange={setCurrentEntry}
                onRatingChange={setCurrentRating}
                onSave={onSave}
              />
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};