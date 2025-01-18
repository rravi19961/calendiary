import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyImageCarousel } from "./DailyImageCarousel";

interface PhotoGallerySectionProps {
  selectedDate: Date;
}

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({ selectedDate }) => {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Photo Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        <DailyImageCarousel selectedDate={selectedDate} />
      </CardContent>
    </Card>
  );
};