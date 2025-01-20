import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();

  useEffect(() => {
    const fetchImages = async () => {
      if (!user) {
        console.log("No user found, cannot fetch images");
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        console.log("Fetching images for date:", formattedDate);
        
        const { data: entries, error } = await supabase
          .from("diary_entries")
          .select("image_url")
          .eq("user_id", user.id)
          .eq("date", formattedDate)
          .not("image_url", "is", null);

        if (error) {
          console.error("Error fetching images:", error);
          toast({
            title: "Error",
            description: "Failed to load images",
            variant: "destructive",
          });
          return;
        }

        const validImages = entries
          ?.map(entry => entry.image_url)
          .filter((url): url is string => Boolean(url));
        
        console.log("Fetched valid images:", validImages);
        setImages(validImages || []);
        
        if (validImages?.length === 0) {
          console.log("No images found for date:", formattedDate);
        }
      } catch (error) {
        console.error("Error in fetchImages:", error);
        toast({
          title: "Error",
          description: "Failed to load images",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [selectedDate, user, toast]);

  if (isLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-muted-foreground">
        Loading images...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-muted-foreground">
        Please log in to view images
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-muted-foreground">
        No images uploaded for {format(selectedDate, "MMMM d, yyyy")}
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col space-y-4">
      <Carousel 
        className="w-full max-w-md mx-auto flex-1"
        onSelect={(api: any) => setCurrentIndex(api.selectedScrollSnap())}
      >
        <CarouselContent className="h-full">
          {images.map((imageUrl, index) => (
            <CarouselItem key={index} className="h-full">
              <div 
                className="w-full h-full relative cursor-pointer flex items-center justify-center"
                onClick={() => setFullscreenImage(imageUrl)}
              >
                <img
                  src={imageUrl}
                  alt={`Entry image ${index + 1}`}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                  onError={(e) => {
                    console.error("Failed to load image:", imageUrl);
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>
      
      <div className="text-center text-sm text-muted-foreground">
        {currentIndex + 1} of {images.length}
      </div>

      <Dialog open={!!fullscreenImage} onOpenChange={() => setFullscreenImage(null)}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
          <div className="relative w-full h-full flex items-center justify-center bg-black/50 rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 bg-black/20 hover:bg-black/40 text-white"
              onClick={() => setFullscreenImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            {fullscreenImage && (
              <img
                src={fullscreenImage}
                alt="Full size"
                className="max-w-[80%] max-h-[80vh] object-contain"
                onError={(e) => {
                  console.error("Failed to load fullscreen image:", fullscreenImage);
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};