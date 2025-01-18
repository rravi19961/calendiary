import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Volume2, Loader2 } from "lucide-react";
import { useState } from "react";

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

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
      const { data, error } = await supabase.functions.invoke('generate-day-summary', {
        body: {
          date: format(selectedDate, "yyyy-MM-dd"),
          userId: user?.id
        }
      });

      if (error) throw error;

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

  const handlePlayAudio = () => {
    if (!summary?.audio_url) return;

    if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    } else {
      const newAudio = new Audio(summary.audio_url);
      newAudio.addEventListener('ended', () => setIsPlaying(false));
      newAudio.addEventListener('pause', () => setIsPlaying(false));
      newAudio.addEventListener('play', () => setIsPlaying(true));
      setAudio(newAudio);
      newAudio.play();
      setIsPlaying(true);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Your Day Highlights</CardTitle>
        {summary?.audio_url && (
          <Button
            variant="outline"
            size="icon"
            onClick={handlePlayAudio}
            className={`transition-all duration-200 ${isPlaying ? 'bg-primary text-primary-foreground' : ''}`}
          >
            <Volume2 className={`h-4 w-4 ${isPlaying ? 'animate-pulse' : ''}`} />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
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