import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DailyImageCarouselProps {
  selectedDate: Date;
}

export const DailyImageCarousel = ({ selectedDate }: DailyImageCarouselProps) => {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchImages = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        console.log("Fetching images for date:", format(selectedDate, "yyyy-MM-dd"));
        
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
        
        console.log("Fetched images:", validImages);
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
    return (
      <div className="min-h-[200px] flex items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-muted-foreground">
        No images uploaded for this day
      </div>
    );
  }

  return (
    <div className="min-h-[200px] w-full space-y-2">
      <h3 className="text-lg font-semibold mb-4">Photo Gallery</h3>
      <Carousel 
        className="w-full max-w-md mx-auto"
        onSelect={(index: number) => setCurrentIndex(index)}
      >
        <CarouselContent>
          {images.map((imageUrl, index) => (
            <CarouselItem key={index}>
              <div 
                className="aspect-square relative cursor-pointer"
                onClick={() => setFullscreenImage(imageUrl)}
              >
                <img
                  src={imageUrl}
                  alt={`Entry image ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
      
      <div className="text-center text-sm text-muted-foreground">
        {currentIndex + 1} of {images.length}
      </div>

      <Dialog open={!!fullscreenImage} onOpenChange={() => setFullscreenImage(null)}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
          <div className="relative w-full h-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-50"
              onClick={() => setFullscreenImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            {fullscreenImage && (
              <img
                src={fullscreenImage}
                alt="Full size"
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};