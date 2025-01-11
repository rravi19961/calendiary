import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

interface DayHighlightsSectionProps {
  selectedDate: Date;
}

export const DayHighlightsSection: React.FC<DayHighlightsSectionProps> = ({
  selectedDate,
}) => {
  const { user } = useAuth();

  const { data: dayResponses = [], isLoading: isResponsesLoading } = useQuery({
    queryKey: ["day-responses", selectedDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("question_responses")
        .select(`
          *,
          question_choices (choice_text)
        `)
        .eq("date", format(selectedDate, "yyyy-MM-dd"));

      if (error) throw error;
      return data;
    },
  });

  if (isResponsesLoading) {
    return (
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Your Day Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Your Day Highlights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dayResponses.map((response: any) => (
            <div key={response.id} className="text-muted-foreground">
              {response.question_choices?.choice_text || response.other_text}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};