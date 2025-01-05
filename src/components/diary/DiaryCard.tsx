import React, { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Smile, SmilePlus } from "lucide-react";

interface DiaryCardProps {
  title: string;
  content: string;
  date: Date;
  rating: number;
}

export const DiaryCard: React.FC<DiaryCardProps> = ({
  title,
  content,
  date,
  rating,
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
        <div className={`absolute w-full h-full backface-hidden ${!isFlipped ? "z-10" : "z-0"}`}>
          <div className="neo-card h-full p-6 flex flex-col justify-between">
            <h3 className="text-xl font-semibold">{title}</h3>
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
          className={`absolute w-full h-full backface-hidden rotate-y-180 ${isFlipped ? "z-10" : "z-0"}`}
        >
          <div className="neo-card h-full p-6 overflow-auto">
            <p className="text-sm text-muted-foreground">{content}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};