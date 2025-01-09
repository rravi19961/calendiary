import React, { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Smile, SmilePlus, Star, Pin } from "lucide-react";

interface DiaryCardProps {
  title: string;
  content: string;
  date: Date;
  rating: number;
  isPinned?: boolean;
  isBestDay?: boolean;
}

export const DiaryCard: React.FC<DiaryCardProps> = ({
  title,
  content,
  date,
  rating,
  isPinned = false,
  isBestDay = false,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative w-full h-[200px] cursor-pointer perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        className="w-full h-full relative preserve-3d"
      >
        {/* Front of card */}
        <div
          className={`absolute w-full h-full backface-hidden ${
            !isFlipped ? "z-10" : "z-0"
          }`}
        >
          <div className="neo-card h-full p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold">{title}</h3>
              <div className="flex gap-2">
                {isPinned && (
                  <Pin className="h-4 w-4 text-primary" />
                )}
                {isBestDay && (
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              {rating === 5 ? (
                <SmilePlus className="h-6 w-6 text-green-500" />
              ) : (
                <Smile className="h-6 w-6 text-green-400" />
              )}
              <span className="text-sm text-muted-foreground">
                {format(date, "MMM d, yyyy")}
              </span>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={`absolute w-full h-full backface-hidden rotate-y-180 ${
            isFlipped ? "z-10" : "z-0"
          }`}
        >
          <div className="neo-card h-full p-6 overflow-auto">
            <p className="text-sm text-muted-foreground">{content}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};