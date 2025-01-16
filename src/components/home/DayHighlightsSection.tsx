import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { TextToSpeech } from "@/components/diary/TextToSpeech";

interface DayHighlightsSectionProps {
  selectedDate: Date;
}

export const DayHighlightsSection = ({ selectedDate }: DayHighlightsSectionProps) => {
  const { user } = useAuth();

  const { data: summary, isLoading } = useQuery({
    queryKey: ["day-summary", selectedDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("day_summaries")
        .select("*")
        .eq("user_id", user?.id)
        .eq("date", format(selectedDate, "yyyy-MM-dd"))
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Day Highlights</CardTitle>
        {summary?.content && <TextToSpeech text={summary.content} />}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : summary ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{summary.title}</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{summary.content}</p>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No summary available for this date
          </p>
        )}
      </CardContent>
    </Card>
  );
};