import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MoodSelector } from "./MoodSelector";

interface EntryFormProps {
  content: string;
  rating: number;
  disabled?: boolean;
  onChange: (changes: { content?: string; rating?: number }) => void;
}

export const EntryForm: React.FC<EntryFormProps> = ({
  content,
  rating,
  disabled,
  onChange,
}) => {
  const maxLength = 500;
  const remainingChars = maxLength - (content?.length || 0);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>How was your day?</Label>
        <MoodSelector
          rating={rating}
          onChange={(newRating) => onChange({ rating: newRating })}
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <Label className="flex justify-between">
          <span>Write about your day</span>
          <span className="text-sm text-muted-foreground">
            ({remainingChars} characters remaining)
          </span>
        </Label>
        <Textarea
          value={content}
          onChange={(e) => onChange({ content: e.target.value })}
          disabled={disabled}
          placeholder="What happened today?"
          className="min-h-[150px]"
          maxLength={maxLength}
        />
      </div>
    </div>
  );
};