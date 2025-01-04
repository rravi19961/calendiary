import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { EMOJIS } from "./constants";

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
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          How was your day? {EMOJIS[Math.floor(rating) - 1]}
        </label>
        <Slider
          value={[rating]}
          min={1}
          max={5}
          step={1}
          disabled={disabled}
          onValueChange={(value) => onChange({ rating: value[0] })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Write about your day
          <span className="text-xs text-muted-foreground ml-2">
            ({500 - content.length} characters remaining)
          </span>
        </label>
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