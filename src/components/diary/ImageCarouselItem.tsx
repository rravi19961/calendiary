import React from "react";

interface ImageCarouselItemProps {
  imageUrl: string;
  index: number;
  onImageClick: (url: string) => void;
}

export const ImageCarouselItem = ({ imageUrl, index, onImageClick }: ImageCarouselItemProps) => {
  return (
    <div 
      className="w-full h-full relative cursor-pointer flex items-center justify-center"
      onClick={() => onImageClick(imageUrl)}
    >
      <img
        src={imageUrl}
        alt={`Entry image ${index + 1}`}
        className="w-full h-full object-cover rounded-lg shadow-md"
        onError={(e) => {
          console.error("Failed to load image:", imageUrl);
          e.currentTarget.src = "/placeholder.svg";
        }}
      />
    </div>
  );
};