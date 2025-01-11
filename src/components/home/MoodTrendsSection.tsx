import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MoodTracker from "@/components/MoodTracker";
import { DailyImageCarousel } from "@/components/diary/DailyImageCarousel";

export const MoodTrendsSection = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Mood Trends</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <MoodTracker onDateSelect={setSelectedDate} />
        <DailyImageCarousel selectedDate={selectedDate} />
      </CardContent>
    </Card>
  );
};