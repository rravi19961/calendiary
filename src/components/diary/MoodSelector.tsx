import React from "react";
import { Smile, Meh, Frown } from "lucide-react";

interface MoodSelectorProps {
  rating: number;
  onChange: (rating: number) => void;
  disabled: boolean;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  rating,
  onChange,
  disabled,
}) => {
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