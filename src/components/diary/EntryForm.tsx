import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MoodSelector } from "./MoodSelector";
import { VoiceInput } from "./VoiceInput";

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
        <div className="flex items-center justify-between">
          <Label>Write about your day</Label>
          <VoiceInput
            onTranscriptionComplete={(text) => onChange({ content: text })}
            disabled={disabled}
          />
        </div>
        <Textarea
          value={content}
          onChange={(e) => onChange({ content: e.target.value })}
          disabled={disabled}
          placeholder="What happened today?"
          className="min-h-[150px]"
        />
      </div>
    </div>
  );
};