import React from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FullscreenImageModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export const FullscreenImageModal = ({ imageUrl, onClose }: FullscreenImageModalProps) => {
  if (!imageUrl) return null;

  return (
    <Dialog open={!!imageUrl} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 backdrop-blur-modal">
        <div className="relative w-full h-full flex items-center justify-center bg-black/50 rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 bg-black/20 hover:bg-black/40 text-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <img
            src={imageUrl}
            alt="Full size"
            className="max-w-[80%] max-h-[80vh] object-contain"
            onError={(e) => {
              console.error("Failed to load fullscreen image:", imageUrl);
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};