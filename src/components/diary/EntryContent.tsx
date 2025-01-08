import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoodSelector } from "./MoodSelector";

interface EntryContentProps {
  title: string;
  content: string;
  rating: number;
  isCurrentDay: boolean;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onRatingChange: (rating: number) => void;
  onSave: () => void;
  hideTitle?: boolean;
}

export const EntryContent: React.FC<EntryContentProps> = ({
  title,
  content,
  rating,
  isCurrentDay,
  onTitleChange,
  onContentChange,
  onRatingChange,
  onSave,
  hideTitle = false,
}) => {
  return (
    <div className="space-y-6">
      {!hideTitle && (
        <Input
          value={title}
          onChange={(e) => isCurrentDay && onTitleChange(e.target.value)}
          readOnly={!isCurrentDay}
          className="font-semibold"
          placeholder="Entry Title"
        />
      )}
      <Textarea
        value={content}
        onChange={(e) => isCurrentDay && onContentChange(e.target.value)}
        placeholder="Write about your day..."
        className="flex-grow min-h-[200px] resize-none"
        readOnly={!isCurrentDay}
      />
      <div className="space-y-4">
        <MoodSelector
          rating={rating}
          onChange={onRatingChange}
          disabled={!isCurrentDay}
        />
        {isCurrentDay && (
          <Button onClick={onSave} className="w-full">
            Save Entry
          </Button>
        )}
      </div>
    </div>
  );
};