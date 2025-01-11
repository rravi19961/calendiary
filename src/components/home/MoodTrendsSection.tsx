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
      <CardContent className="space-y-8">
        <MoodTracker onDateSelect={setSelectedDate} />
        <div className="pt-2 border-t">
          <DailyImageCarousel selectedDate={selectedDate} />
        </div>
      </CardContent>
    </Card>
  );
};