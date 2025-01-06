import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight } from "lucide-react";

interface Choice {
  id: string;
  choice_text: string;
  is_other: boolean;
}

interface QuestionCardProps {
  question: {
    id: string;
    question_text: string;
    question_type: "single" | "multiple";
    choices: Choice[];
  };
  responses: Record<string, any>;
  otherText: Record<string, string>;
  onResponse: (value: any, isOther?: boolean) => void;
  onOtherTextChange: (questionId: string, value: string) => void;
  onSave: () => void;
  isLastQuestion: boolean;
}

export const QuestionCard = ({
  question,
  responses,
  otherText,
  onResponse,
  onOtherTextChange,
  onSave,
  isLastQuestion,
}: QuestionCardProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">{question.question_text}</h3>

      {question.question_type === "multiple" ? (
        <div className="space-y-2">
          {question.choices.map((choice) => (
            <div key={choice.id} className="flex items-start space-x-2">
              <Checkbox
                id={choice.id}
                checked={(responses[question.id] || []).includes(choice.id)}
                onCheckedChange={(checked) => onResponse(choice.id, choice.is_other)}
              />
              <Label htmlFor={choice.id} className="text-sm">
                {choice.choice_text}
              </Label>
            </div>
          ))}
        </div>
      ) : (
        <RadioGroup
          value={responses[question.id]}
          onValueChange={(value) => {
            const choice = question.choices.find((c) => c.id === value);
            onResponse(value, choice?.is_other);
          }}
        >
          <div className="space-y-2">
            {question.choices.map((choice) => (
              <div key={choice.id} className="flex items-center space-x-2">
                <RadioGroupItem value={choice.id} id={choice.id} />
                <Label htmlFor={choice.id}>{choice.choice_text}</Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      )}

      {otherText[question.id] !== undefined && (
        <Input
          placeholder="Specify other..."
          value={otherText[question.id]}
          onChange={(e) => onOtherTextChange(question.id, e.target.value)}
          className="mt-2"
        />
      )}

      <Button
        onClick={onSave}
        disabled={!responses[question.id]}
        className="w-full mt-4"
      >
        {isLastQuestion ? (
          "Finish"
        ) : (
          <>
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
};