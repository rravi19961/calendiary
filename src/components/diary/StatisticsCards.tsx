import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Smile, Pin, Star } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface StatisticsCardsProps {
  stats: {
    summarizedDays: number;
    lastCheerfulDay: {
      date: string;
      rating: number;
      id: string;
    } | null;
    pinnedCount: number;
    bestDaysCount: number;
  };
  onLastCheerfulDayClick: (id: string) => void;
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

export const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  stats,
  onLastCheerfulDayClick,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Summarized Days</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.summarizedDays}</div>
        </CardContent>
      </Card>

      <Card 
        className={stats.lastCheerfulDay ? "cursor-pointer hover:shadow-lg transition-shadow" : ""}
        onClick={() => stats.lastCheerfulDay && onLastCheerfulDayClick(stats.lastCheerfulDay.id)}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Cheerful Day</CardTitle>
          <Smile className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl">
            {stats.lastCheerfulDay ? getMoodEmoji(stats.lastCheerfulDay.rating) : "—"}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.lastCheerfulDay
              ? format(new Date(stats.lastCheerfulDay.date), "MMM d, yyyy")
              : "No cheerful days yet"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pinned Days</CardTitle>
          <Pin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pinnedCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Best Days</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.bestDaysCount}</div>
        </CardContent>
      </Card>
    </div>
  );
};