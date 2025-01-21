import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Smile, Pin, Star } from "lucide-react";
import { format } from "date-fns";
import { getMoodEmoji } from "@/utils/moodEmoji";

interface StatsSummary {
  summarizedDays: number;
  lastCheerfulDay: {
    date: string;
    rating: number;
    id: string;
  } | null;
  pinnedCount: number;
  bestDaysCount: number;
}

interface StatisticsSectionProps {
  stats: StatsSummary;
  onLastCheerfulDayClick: (id: string) => void;
}

export const StatisticsSection = ({ stats, onLastCheerfulDayClick }: StatisticsSectionProps) => {
  const cardClass = "bg-calendiary-primary text-white hover:bg-calendiary-hover transition-colors";
  const iconClass = "h-4 w-4 text-white/80";
  const titleClass = "text-sm font-medium text-white/90";
  const valueClass = "text-2xl font-bold text-white";

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className={cardClass}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={titleClass}>Summarized Days</CardTitle>
          <Calendar className={iconClass} />
        </CardHeader>
        <CardContent>
          <div className={valueClass}>{stats.summarizedDays}</div>
        </CardContent>
      </Card>

      <Card className={cardClass}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={titleClass}>Pinned Days</CardTitle>
          <Pin className={iconClass} />
        </CardHeader>
        <CardContent>
          <div className={valueClass}>{stats.pinnedCount}</div>
        </CardContent>
      </Card>

      <Card className={cardClass}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={titleClass}>Best Days</CardTitle>
          <Star className={iconClass} />
        </CardHeader>
        <CardContent>
          <div className={valueClass}>{stats.bestDaysCount}</div>
        </CardContent>
      </Card>

      <Card 
        className={`${cardClass} ${stats.lastCheerfulDay ? "cursor-pointer" : ""}`}
        onClick={() => stats.lastCheerfulDay && onLastCheerfulDayClick(stats.lastCheerfulDay.id)}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={titleClass}>Last Cheerful Day</CardTitle>
          <Smile className={iconClass} />
        </CardHeader>
        <CardContent>
          <div className="text-3xl">
            {stats.lastCheerfulDay ? getMoodEmoji(stats.lastCheerfulDay.rating) : "—"}
          </div>
          <p className="text-xs text-white/80 mt-1">
            {stats.lastCheerfulDay 
              ? format(new Date(stats.lastCheerfulDay.date), "MMM d, yyyy")
              : "No cheerful days yet"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};