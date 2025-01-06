import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QuestionChoice } from "./questions/QuestionChoice";
import { QuestionHeader } from "./questions/QuestionHeader";

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
    <Card className="p-5 min-h-[600px]">
      <div className="space-y-6">
        <QuestionHeader 
          currentIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          onBack={onBack}
        />

        <h3 className="text-lg font-medium mb-6">{currentQuestion.question_text}</h3>

        {currentQuestion.question_type === "multiple" ? (
          <div className="space-y-4">
            {currentQuestion.choices.map((choice) => (
              <QuestionChoice
                key={choice.id}
                choice={choice}
                type="multiple"
                isSelected={(responses[currentQuestion.id] || []).includes(choice.id)}
                onSelect={handleResponse}
              />
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
              <QuestionChoice
                key={choice.id}
                choice={choice}
                type="single"
                isSelected={responses[currentQuestion.id] === choice.id}
                onSelect={handleResponse}
              />
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
