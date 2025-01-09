import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { DiaryCard } from "@/components/diary/DiaryCard";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Smile, Star, Pin, Calendar } from "lucide-react";

const timeRanges = [
  { value: "7", label: "Last 7 Days" },
  { value: "30", label: "Last 30 Days" },
  { value: "90", label: "Last 90 Days" },
  { value: "all", label: "All Time" },
];

const DaysReview = () => {
  const [timeRange, setTimeRange] = useState("30");
  const { toast } = useToast();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["diary-entries", timeRange],
    queryFn: async () => {
      const daysAgo = timeRange === "all" ? undefined : parseInt(timeRange);
      let query = supabase
        .from("diary_entries")
        .select("*")
        .order("date", { ascending: false });

      if (daysAgo) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysAgo);
        query = query.gte("date", format(startDate, "yyyy-MM-dd"));
      }

      const { data, error } = await query;

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load your entries. Please try again.",
          variant: "destructive",
        });
        throw error;
      }

      return data.map((entry) => ({
        ...entry,
        date: new Date(entry.date),
      }));
    },
  });

  const stats = {
    totalEntries: entries.length,
    bestMoodDay: entries.reduce(
      (best, current) =>
        (current.rating || 0) > (best.rating || 0) ? current : best,
      entries[0] || { rating: 0 }
    ),
    pinnedCount: entries.filter((entry) => entry.is_pinned).length,
    bestDaysCount: entries.filter((entry) => entry.is_best_day).length,
  };

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold">Days Review</h1>
          <p className="text-muted-foreground">
            Reflect on your past to shape your future
          </p>
          <div className="w-48">
            <Select
              value={timeRange}
              onValueChange={(value) => setTimeRange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEntries}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Mood Day</CardTitle>
              <Smile className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.bestMoodDay?.rating || 0}/5
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.bestMoodDay?.date
                  ? format(new Date(stats.bestMoodDay.date), "MMM d, yyyy")
                  : "No entries"}
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

        {isLoading ? (
          <div className="grid place-items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map((entry) => (
              <DiaryCard
                key={entry.id}
                title={entry.title || "Untitled Entry"}
                content={entry.content || ""}
                date={entry.date}
                rating={entry.rating || 0}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DaysReview;