import React from "react";
import { SummaryCard } from "./SummaryCard";

interface Summary {
  id: string;
  title: string;
  content: string;
  date: string;
  rating: number;
  is_pinned: boolean;
  is_best_day: boolean;
}

interface SummaryListProps {
  summaries: Summary[];
  onTogglePin: (id: string) => Promise<void>;
  onToggleBestDay: (id: string) => Promise<void>;
  onMaximize: (summary: Summary) => void;
  isLoading: boolean;
}

export const SummaryList: React.FC<SummaryListProps> = ({
  summaries,
  onTogglePin,
  onToggleBestDay,
  onMaximize,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid place-items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {summaries.map((summary) => (
        <SummaryCard
          key={summary.id}
          id={summary.id}
          title={summary.title || "Untitled Summary"}
          content={summary.content}
          date={summary.date}
          rating={summary.rating || 3}
          isPinned={summary.is_pinned || false}
          isBestDay={summary.is_best_day || false}
          onTogglePin={onTogglePin}
          onToggleBestDay={onToggleBestDay}
          onMaximize={() => onMaximize(summary)}
        />
      ))}
    </div>
  );
};