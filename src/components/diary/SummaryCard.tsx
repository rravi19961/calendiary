import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Star, Pin, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  id: string;
  title: string;
  content: string;
  date: string;
  rating: number;
  isPinned: boolean;
  isBestDay: boolean;
  onTogglePin: (id: string) => void;
  onToggleBestDay: (id: string) => void;
  onMaximize: () => void;
}

const getMoodEmoji = (rating: number) => {
  switch (rating) {
    case 5: return "😍";
    case 4: return "😊";
    case 3: return "😐";
    case 2: return "😟";
    case 1: return "😭";
    default: return "😐";
  }
};

export const SummaryCard: React.FC<SummaryCardProps> = ({
  id,
  title,
  content,
  date,
  rating,
  isPinned,
  isBestDay,
  onTogglePin,
  onToggleBestDay,
  onMaximize,
}) => {
  const moodEmoji = getMoodEmoji(rating);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{moodEmoji}</span>
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onTogglePin(id)}
            className={cn(
              "hover:bg-blue-100 dark:hover:bg-blue-900",
              isPinned && "text-blue-500"
            )}
          >
            <Pin className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleBestDay(id)}
            className={cn(
              "hover:bg-yellow-100 dark:hover:bg-yellow-900",
              isBestDay && "text-yellow-500"
            )}
          >
            <Star className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="h-24 overflow-hidden relative mb-4">
        <p className="text-gray-600 dark:text-gray-300 line-clamp-3">{content}</p>
        {content.length > 150 && (
          <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-white dark:from-gray-800 to-transparent" />
        )}
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {format(new Date(date), "MMM d, yyyy")}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onMaximize}
          className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ArrowUpRight className="h-4 w-4 mr-1" />
          Read more
        </Button>
      </div>
    </motion.div>
  );
};