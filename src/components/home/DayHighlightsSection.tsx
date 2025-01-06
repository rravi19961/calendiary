import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DayHighlightsSectionProps {
  selectedDate: Date;
}

export const DayHighlightsSection: React.FC<DayHighlightsSectionProps> = ({
  selectedDate,
}) => {
  const { data: dayResponses = [] } = useQuery({
    queryKey: ["day-responses", selectedDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("question_responses")
        .select(`
          *,
          daily_questions (question_text),
          question_choices (choice_text)
        `)
        .eq("date", format(selectedDate, "yyyy-MM-dd"));

      if (error) throw error;
      return data;
    },
  });

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Your Day Highlights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dayResponses.map((response: any) => (
            <div key={response.id} className="space-y-1">
              <p className="font-medium">Q: {response.daily_questions?.question_text}</p>
              <p className="text-muted-foreground">
                A: {response.question_choices?.choice_text || response.other_text}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};