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

export const DayHighlightsSection: React.FC<DayHighlightsSectionProps> = ({
  selectedDate,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = React.useState(false);

  const { data: summary, isLoading: isSummaryLoading, refetch: refetchSummary } = useQuery({
    queryKey: ["day-summary", selectedDate],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("generate-day-summary", {
        body: {
          date: format(selectedDate, "yyyy-MM-dd"),
          userId: user?.id,
        },
      });

      if (error) throw error;
      return data.summary;
    },
    enabled: false, // Don't fetch automatically
  });

  const handleGenerateSummary = async () => {
    try {
      setIsGenerating(true);
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
          {summary && (
            <div className="text-muted-foreground mb-4 italic">
              "{summary}"
            </div>
          )}
          <Button
            onClick={handleGenerateSummary}
            disabled={isGenerating}
            className="w-full mt-4"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? "Generating..." : "Generate Summary"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};