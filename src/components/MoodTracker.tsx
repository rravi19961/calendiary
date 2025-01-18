import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";
import { format, subDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getMoodEmoji } from "@/utils/moodEmoji";

interface MoodData {
  date: string;
  rating: number;
}

interface MoodTrackerProps {
  onDateSelect?: (date: Date) => void;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ onDateSelect }) => {
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchMoodData = async () => {
      if (!user) return;

      try {
        const endDate = new Date();
        const startDate = subDays(endDate, 6);

        const { data: entries, error } = await supabase
          .from("diary_entries")
          .select("date, rating")
          .eq("user_id", user.id)
          .gte("date", format(startDate, "yyyy-MM-dd"))
          .lte("date", format(endDate, "yyyy-MM-dd"))
          .order("date", { ascending: true });

        if (error) throw error;

        const moodsByDay = new Map<string, number[]>();

        for (let i = 0; i <= 6; i++) {
          const date = format(subDays(endDate, i), "yyyy-MM-dd");
          moodsByDay.set(date, []);
        }

        entries?.forEach((entry) => {
          if (entry.rating) {
            const ratings = moodsByDay.get(entry.date) || [];
            ratings.push(entry.rating);
            moodsByDay.set(entry.date, ratings);
          }
        });

        const averagedData: MoodData[] = Array.from(moodsByDay.entries())
          .map(([date, ratings]) => ({
            date: format(new Date(date), "EEE"),
            rating: ratings.length > 0
              ? Number((ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1))
              : 3
          }))
          .reverse();

        setMoodData(averagedData);
      } catch (error) {
        console.error("Error fetching mood data:", error);
        toast({
          title: "Error",
          description: "Failed to load mood trends. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoodData();
  }, [user, toast]);

  const CustomYAxisTick = ({ x, y, payload }: any) => {
    const emojiIndex = Math.round(payload.value) - 1;
    return (
      <text x={x} y={y} dy={5} textAnchor="end" fontSize={16}>
        {getMoodEmoji(emojiIndex + 1)}
      </text>
    );
  };

  if (isLoading) {
    return <div className="h-48 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={moodData}>
          <CartesianGrid 
            horizontal={true} 
            vertical={false}
          />
          <XAxis 
            dataKey="date"
            stroke="currentColor"
            fontSize={12}
          />
          <YAxis
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={<CustomYAxisTick />}
            stroke="currentColor"
          />
          <Line
            type="monotone"
            dataKey="rating"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodTracker;
