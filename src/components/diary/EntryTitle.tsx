import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface EntryTitleProps {
  title: string;
  disabled?: boolean;
  onChange: (title: string) => void;
  quote: string;
}

export const EntryTitle: React.FC<EntryTitleProps> = ({
  title,
  disabled,
  onChange,
  quote,
}) => {
  return (
    <div className="space-y-2 relative">
      <Label className="flex items-center">
        Title
        <span className="text-destructive ml-1">*</span>
      </Label>
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 text-center px-4">
          <p className="text-sm italic">{quote}</p>
        </div>
        <Input
          value={title}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Enter a title for your entry"
          required
          className="bg-transparent relative z-10"
        />
      </div>
    </div>
  );
};