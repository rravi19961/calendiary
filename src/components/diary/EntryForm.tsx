import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Smile, Meh, Frown } from "lucide-react";

interface EntryFormProps {
  content: string;
  rating: number;
  disabled?: boolean;
  onChange: (changes: { content?: string; rating?: number }) => void;
}

const MOOD_EMOJIS = [
  { icon: Frown, label: "Very Sad", value: 1 },
  { icon: Frown, label: "Sad", value: 2 },
  { icon: Meh, label: "Neutral", value: 3 },
  { icon: Smile, label: "Happy", value: 4 },
  { icon: Smile, label: "Very Happy", value: 5 },
];

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
          How was your day?
        </label>
        <div className="flex justify-between items-center gap-2">
          {MOOD_EMOJIS.map(({ icon: Icon, label, value }) => (
            <button
              key={value}
              onClick={() => !disabled && onChange({ rating: value })}
              disabled={disabled}
              className={`p-2 rounded-lg transition-all ${
                rating === value
                  ? "bg-primary text-primary-foreground scale-110"
                  : "hover:bg-secondary"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              title={label}
            >
              <Icon
                className={`w-8 h-8 ${
                  rating === value ? "animate-bounce" : ""
                }`}
              />
            </button>
          ))}
        </div>
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
          maxLength={500}
        />
      </div>
    </div>
  );
};