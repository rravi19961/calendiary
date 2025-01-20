import React from "react";

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
    { emoji: "😭", value: 1, label: "Very Sad" },
    { emoji: "😟", value: 2, label: "Sad" },
    { emoji: "😐", value: 3, label: "Neutral" },
    { emoji: "😊", value: 4, label: "Happy" },
    { emoji: "😍", value: 5, label: "Very Happy" },
  ];

  return (
    <div className="flex justify-center gap-2">
      {moods.map(({ emoji, value, label }) => (
        <button
          key={value}
          onClick={() => !disabled && onChange(value)}
          disabled={disabled}
          className={`p-2 rounded-lg transition-all text-xl ${
            rating === value
              ? "bg-primary text-primary-foreground scale-110"
              : "hover:bg-secondary"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          title={label}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};