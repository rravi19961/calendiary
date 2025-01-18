import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
      <CardHeader className="pb-2">
        <h2 className="text-2xl font-bold text-calendiary-primary text-left">Mood Trends</h2>
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