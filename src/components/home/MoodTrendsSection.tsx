import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MoodTracker from "@/components/MoodTracker";
import { PhotoGallerySection } from "@/components/diary/PhotoGallerySection";
import { Separator } from "@/components/ui/separator";

export const MoodTrendsSection = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleDateSelect = (date: Date) => {
    console.log("MoodTrendsSection: Date selected:", date);
    setSelectedDate(date);
  };

  return (
    <Card className="glass">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Mood Trends</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <MoodTracker onDateSelect={handleDateSelect} />
        <div className="space-y-4">
          <Separator className="my-4" />
          <PhotoGallerySection selectedDate={selectedDate} />
        </div>
      </CardContent>
    </Card>
  );
};