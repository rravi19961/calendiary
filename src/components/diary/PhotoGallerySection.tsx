import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DailyImageCarousel } from "./DailyImageCarousel";

interface PhotoGallerySectionProps {
  selectedDate: Date;
}

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({ selectedDate }) => {
  return (
    <Card className="glass">
      <CardHeader className="pb-2">
        <h2 className="text-2xl font-bold text-calendiary-primary text-left">Photo Gallery</h2>
      </CardHeader>
      <CardContent>
        <DailyImageCarousel selectedDate={selectedDate} />
      </CardContent>
    </Card>
  );
};