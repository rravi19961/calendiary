import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroupItem } from "@/components/ui/radio-group";

interface Choice {
  id: string;
  choice_text: string;
  is_other: boolean;
}

interface QuestionChoiceProps {
  choice: Choice;
  type: "single" | "multiple";
  isSelected: boolean;
  onSelect: (choiceId: string, isOther: boolean) => void;
}

export const QuestionChoice = ({ choice, type, isSelected, onSelect }: QuestionChoiceProps) => {
  return (
    <div className="flex items-start space-x-3 p-1 hover:bg-accent/5 rounded-md">
      {type === "multiple" ? (
        <Checkbox
          id={choice.id}
          checked={isSelected}
          onCheckedChange={() => onSelect(choice.id, choice.is_other)}
          className="mt-1"
        />
      ) : (
        <RadioGroupItem value={choice.id} id={choice.id} className="mt-1" />
      )}
      <Label 
        htmlFor={choice.id} 
        className="text-base font-medium cursor-pointer hover:text-primary transition-colors"
      >
        {choice.choice_text}
      </Label>
    </div>
  );
};