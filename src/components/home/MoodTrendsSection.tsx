import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MoodTracker from "@/components/MoodTracker";
import { DailyImageCarousel } from "@/components/diary/DailyImageCarousel";
import { Separator } from "@/components/ui/separator";

export const MoodTrendsSection = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Mood Trends</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <MoodTracker onDateSelect={setSelectedDate} />
        <div className="space-y-4">
          <Separator className="my-4" />
          <DailyImageCarousel selectedDate={selectedDate} />
        </div>
      </CardContent>
    </Card>
  );
};