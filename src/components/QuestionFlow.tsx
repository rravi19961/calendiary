import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  question_text: string;
  question_type: "single" | "multiple";
  choices: Choice[];
}

interface Choice {
  id: string;
  choice_text: string;
  is_other: boolean;
}

export const QuestionFlow = ({ onBack }: { onBack: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [otherText, setOtherText] = useState<Record<string, string>>({});

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ["daily-questions"],
    queryFn: async () => {
      const { data: questionsData, error: questionsError } = await supabase
        .from("daily_questions")
        .select("*")
        .order("order_number");

      if (questionsError) throw questionsError;

      const { data: choicesData, error: choicesError } = await supabase
        .from("question_choices")
        .select("*")
        .order("order_number");

      if (choicesError) throw choicesError;

      return questionsData.map((q: any) => ({
        ...q,
        choices: choicesData.filter((c: any) => c.question_id === q.id),
      }));
    },
  });

  const currentQuestion: Question | undefined = questions[currentQuestionIndex];

  const handleResponse = async (value: any, isOther: boolean = false) => {
    if (!currentQuestion || !user) return;

    const questionId = currentQuestion.id;
    const today = new Date().toISOString().split('T')[0];

    if (currentQuestion.question_type === "multiple") {
      const currentResponses = responses[questionId] || [];
      const newResponses = currentResponses.includes(value)
        ? currentResponses.filter((v: string) => v !== value)
        : [...currentResponses, value];
      setResponses({ ...responses, [questionId]: newResponses });
    } else {
      setResponses({ ...responses, [questionId]: value });
    }

    if (isOther) {
      setOtherText({ ...otherText, [questionId]: "" });
    }
  };

  const saveResponse = async () => {
    if (!currentQuestion || !user) return;

    const questionId = currentQuestion.id;
    const response = responses[questionId];
    const today = new Date().toISOString().split('T')[0];

    try {
      if (currentQuestion.question_type === "multiple") {
        await Promise.all(
          response.map((choiceId: string) =>
            supabase.from("question_responses").insert({
              user_id: user.id,
              question_id: questionId,
              choice_id: choiceId,
              other_text: otherText[questionId],
              date: today,
            })
          )
        );
      } else {
        await supabase.from("question_responses").insert({
          user_id: user.id,
          question_id: questionId,
          choice_id: response,
          other_text: otherText[questionId],
          date: today,
        });
      }

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        toast({
          title: "All done!",
          description: "Your responses have been saved.",
        });
        onBack();
      }
    } catch (error) {
      console.error("Error saving response:", error);
      toast({
        title: "Error",
        description: "Failed to save your response. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading || !currentQuestion) {
    return <div>Loading questions...</div>;
  }

  return (
    <Card className="p-6 min-h-[600px]">
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <span className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>

        <h3 className="text-lg font-medium mb-6">{currentQuestion.question_text}</h3>

        {currentQuestion.question_type === "multiple" ? (
          <div className="space-y-4">
            {currentQuestion.choices.map((choice) => (
              <div key={choice.id} className="flex items-start space-x-3 p-2">
                <Checkbox
                  id={choice.id}
                  checked={(responses[currentQuestion.id] || []).includes(choice.id)}
                  onCheckedChange={(checked) => handleResponse(choice.id, choice.is_other)}
                  className="mt-1"
                />
                <Label 
                  htmlFor={choice.id} 
                  className="text-base font-medium cursor-pointer hover:text-primary transition-colors"
                >
                  {choice.choice_text}
                </Label>
              </div>
            ))}
            {otherText[currentQuestion.id] !== undefined && (
              <Input
                placeholder="Specify other..."
                value={otherText[currentQuestion.id]}
                onChange={(e) =>
                  setOtherText({ ...otherText, [currentQuestion.id]: e.target.value })
                }
                className="mt-4"
              />
            )}
          </div>
        ) : (
          <RadioGroup
            value={responses[currentQuestion.id]}
            onValueChange={(value) => {
              const choice = currentQuestion.choices.find((c) => c.id === value);
              handleResponse(value, choice?.is_other);
            }}
            className="space-y-4"
          >
            {currentQuestion.choices.map((choice) => (
              <div key={choice.id} className="flex items-center space-x-3 p-2">
                <RadioGroupItem value={choice.id} id={choice.id} className="mt-1" />
                <Label 
                  htmlFor={choice.id} 
                  className="text-base font-medium cursor-pointer hover:text-primary transition-colors"
                >
                  {choice.choice_text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {otherText[currentQuestion.id] !== undefined && (
          <Input
            placeholder="Specify other..."
            value={otherText[currentQuestion.id]}
            onChange={(e) =>
              setOtherText({ ...otherText, [currentQuestion.id]: e.target.value })
            }
            className="mt-4"
          />
        )}

        <Button
          onClick={saveResponse}
          disabled={!responses[currentQuestion.id]}
          className="w-full mt-8"
        >
          {currentQuestionIndex === questions.length - 1 ? (
            "Finish"
          ) : (
            <>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};