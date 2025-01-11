import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface DailyImageCarouselProps {
  selectedDate: Date;
}

export const DailyImageCarousel = ({ selectedDate }: DailyImageCarouselProps) => {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchImages = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data: entries, error } = await supabase
          .from("diary_entries")
          .select("image_url")
          .eq("user_id", user.id)
          .eq("date", format(selectedDate, "yyyy-MM-dd"))
          .not("image_url", "is", null);

        if (error) throw error;

        const validImages = entries
          .map(entry => entry.image_url)
          .filter((url): url is string => url !== null);
        
        setImages(validImages);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [selectedDate, user]);

  if (isLoading) {
    return <div className="h-48 flex items-center justify-center">Loading...</div>;
  }

  if (images.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-muted-foreground">
        No images uploaded for this day
      </div>
    );
  }

  return (
    <Carousel className="w-full max-w-xs mx-auto">
      <CarouselContent>
        {images.map((imageUrl, index) => (
          <CarouselItem key={index}>
            <div className="aspect-square relative">
              <img
                src={imageUrl}
                alt={`Entry image ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};