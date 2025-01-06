import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { QuestionCard } from "./questions/QuestionCard";
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
    return <div className="min-h-[600px] flex items-center justify-center">Loading questions...</div>;
  }

  return (
    <Card className="p-6 min-h-[600px]">
      <QuestionHeader
        currentIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        onBack={onBack}
      />
      <QuestionCard
        question={currentQuestion}
        responses={responses}
        otherText={otherText}
        onResponse={handleResponse}
        onOtherTextChange={(questionId, value) =>
          setOtherText({ ...otherText, [questionId]: value })
        }
        onSave={saveResponse}
        isLastQuestion={currentQuestionIndex === questions.length - 1}
      />
    </Card>
  );
};