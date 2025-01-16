import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { TextToSpeech } from "@/components/diary/TextToSpeech";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";

interface DayHighlightsSectionProps {
  selectedDate: Date;
}

const highlightAsteriskWords = (text: string) => {
  if (!text) return "";
  return text.replace(/\*([^*]+)\*/g, '<span class="font-bold text-calendiary-primary">$1</span>');
};

export const DayHighlightsSection = ({ selectedDate }: DayHighlightsSectionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: summary, isLoading, refetch } = useQuery({
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

  const handleRegenerateSummary = async () => {
    try {
      const response = await fetch("/api/generate-day-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: format(selectedDate, "yyyy-MM-dd") }),
      });

      if (!response.ok) throw new Error("Failed to generate summary");

      toast({
        title: "Success",
        description: "Summary has been regenerated",
      });

      refetch();
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "Error",
        description: "Failed to generate summary",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold text-calendiary-primary">
          {format(selectedDate, "MMMM d, yyyy")}
        </CardTitle>
        {summary?.content && <TextToSpeech text={summary.content} />}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : summary ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-calendiary-primary">
              {summary.title}
            </h3>
            <div 
              className="text-muted-foreground whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: highlightAsteriskWords(summary.content) }}
            />
            <Button
              onClick={handleRegenerateSummary}
              className="w-full mt-4"
              variant="outline"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate Summary
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No summary available for this date
            </p>
            <Button onClick={handleRegenerateSummary} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate Summary
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};