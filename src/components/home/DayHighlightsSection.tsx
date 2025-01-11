import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";

interface DayHighlightsSectionProps {
  selectedDate: Date;
}

const getEmojiForRating = (rating: number | null) => {
  if (!rating) return "😐";
  if (rating === 5) return "😍";
  if (rating === 4) return "😊";
  if (rating === 3) return "😐";
  if (rating === 2) return "😟";
  return "😭";
};

export const DayHighlightsSection: React.FC<DayHighlightsSectionProps> = ({
  selectedDate,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = React.useState(false);

  const { data: summaryData, isLoading: isSummaryLoading, refetch: refetchSummary } = useQuery({
    queryKey: ["day-summary", selectedDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('day_summaries')
        .select('content, title, rating')
        .eq('date', format(selectedDate, 'yyyy-MM-dd'))
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    },
    enabled: !!user,
  });

  const handleGenerateSummary = async () => {
    try {
      setIsGenerating(true);
      const { data, error } = await supabase.functions.invoke('generate-day-summary', {
        body: {
          date: format(selectedDate, 'yyyy-MM-dd'),
          userId: user?.id,
        },
      });

      if (error) throw error;

      await refetchSummary();
      
      toast({
        title: "Success",
        description: "Summary generated successfully!",
      });
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (isSummaryLoading) {
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
          {summaryData ? (
            <>
              {summaryData.title && (
                <h3 className="text-lg font-semibold text-calendiary-primary mb-2">
                  {getEmojiForRating(summaryData.rating)} {summaryData.title}
                </h3>
              )}
              <div className="text-muted-foreground mb-4 font-serif">
                {summaryData.content}
              </div>
            </>
          ) : (
            <p className="text-muted-foreground">
              No summary generated for this day yet. Click the button below to generate one.
            </p>
          )}
          <Button
            onClick={handleGenerateSummary}
            disabled={isGenerating}
            className="w-full mt-4"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? "Generating..." : summaryData ? "Regenerate Summary" : "Generate Summary"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};