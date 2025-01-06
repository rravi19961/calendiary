import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MoodTracker from "@/components/MoodTracker";

export const MoodTrendsSection = () => {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Mood Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <MoodTracker />
      </CardContent>
    </Card>
  );
};