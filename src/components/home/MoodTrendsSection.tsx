import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MoodTracker from "@/components/MoodTracker";

interface MoodTrendsSectionProps {
  onMoodCalculated?: (mood: number) => void;
}

export const MoodTrendsSection: React.FC<MoodTrendsSectionProps> = ({ onMoodCalculated }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleDateSelect = (date: Date) => {
    console.log("MoodTrendsSection: Date selected:", date);
    setSelectedDate(date);
  };

  return (
    <Card className="h-full glass">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Mood Trends</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)] flex items-center justify-center">
        <div className="w-full max-w-md mx-auto">
          <MoodTracker 
            onDateSelect={handleDateSelect} 
            onMoodCalculated={onMoodCalculated}
          />
        </div>
      </CardContent>
    </Card>
  );
};