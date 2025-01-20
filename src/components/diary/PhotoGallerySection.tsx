import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyImageCarousel } from "./DailyImageCarousel";

interface PhotoGallerySectionProps {
  selectedDate: Date;
}

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({ selectedDate }) => {
  return (
    <Card className="glass">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Photo Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        <DailyImageCarousel selectedDate={selectedDate} />
      </CardContent>
    </Card>
  );
};