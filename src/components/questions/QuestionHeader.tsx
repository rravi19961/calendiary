import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface QuestionHeaderProps {
  currentIndex: number;
  totalQuestions: number;
  onBack: () => void;
}

export const QuestionHeader = ({
  currentIndex,
  totalQuestions,
  onBack,
}: QuestionHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <span className="text-sm text-muted-foreground">
        Question {currentIndex + 1} of {totalQuestions}
      </span>
    </div>
  );
};