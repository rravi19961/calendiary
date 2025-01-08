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
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4 hover:bg-blue-100 dark:hover:bg-blue-900"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[95vw] sm:w-[90vw] p-0 gap-0 backdrop-blur-lg bg-white/90 dark:bg-gray-900/90"
      >
        <div className="h-full flex flex-col sm:flex-row relative">
          {/* Left Panel - Entry Titles */}
          <div className="w-full sm:w-1/3 border-r bg-gray-50/80 dark:bg-gray-800/80">
            <SheetHeader className="p-6 border-b bg-white/50 dark:bg-gray-900/50">
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
                        "w-full justify-start text-left font-normal transition-colors",
                        "hover:bg-blue-100/50 dark:hover:bg-blue-900/30",
                        index === currentEntryIndex && "bg-blue-200/70 dark:bg-blue-800/70"
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 hover:bg-blue-100 dark:hover:bg-blue-900"
            >
              <X className="h-6 w-6" />
            </Button>
            <ScrollArea className="flex-1 p-6 h-[calc(100vh-5rem)]">
              <EntryContent
                title={currentTitle}
                content={currentEntry}
                rating={currentRating}
                isCurrentDay={isCurrentDay}
                onTitleChange={setCurrentTitle}
                onContentChange={setCurrentEntry}
                onRatingChange={setCurrentRating}
                onSave={onSave}
                hideTitle
              />
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};