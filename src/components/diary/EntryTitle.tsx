import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface EntryTitleProps {
  title: string;
  disabled?: boolean;
  onChange: (title: string) => void;
}

export const EntryTitle: React.FC<EntryTitleProps> = ({
  title,
  disabled,
  onChange,
}) => {
  return (
    <div className="space-y-2 w-full">
      <Label className="flex items-center">
        Title
        <span className="text-destructive ml-1">*</span>
      </Label>
      <Input
        value={title}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Enter a title for your entry"
        required
        className="bg-transparent relative z-10"
      />
    </div>
  );
};