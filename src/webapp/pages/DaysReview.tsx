import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { format, subDays, isToday, startOfDay, endOfDay } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StatisticsSection } from "@/components/diary/StatisticsSection";
import { FilterControls } from "@/components/diary/FilterControls";
import { SummaryList } from "@/components/diary/SummaryList";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getMoodEmoji } from "@/utils/moodEmoji";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DaysReview = () => {
  const [timeRange, setTimeRange] = useState("7");
  const [sortBy, setSortBy] = useState("date-desc");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedSummary, setSelectedSummary] = useState<any>(null);
  const { toast } = useToast();

  const { data: allSummaries = [], isLoading } = useQuery({
    queryKey: ["day-summaries", timeRange],
    queryFn: async () => {
      let query = supabase
        .from("day_summaries")
        .select("*")
        .order("date", { ascending: false });

      if (timeRange !== "all") {
        const daysAgo = parseInt(timeRange);
        // Adjust the date range to include exactly N days
        const startDate = startOfDay(subDays(new Date(), daysAgo - 1));
        const endDate = endOfDay(new Date());
        query = query
          .gte("date", format(startDate, "yyyy-MM-dd"))
          .lte("date", format(endDate, "yyyy-MM-dd"));
      }

      const { data, error } = await query;

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load your summaries. Please try again.",
          variant: "destructive",
        });
        throw error;
      }

      return data || [];
    },
  });

  // Calculate total summaries for the time range (independent of tab selection)
  const totalSummariesInRange = useMemo(() => allSummaries.length, [allSummaries]);

  // Filter summaries based on active tab
  const filteredSummaries = useMemo(() => {
    return allSummaries.filter(summary => {
      if (activeTab === "pinned") return summary.is_pinned;
      if (activeTab === "best") return summary.is_best_day;
      return true;
    });
  }, [allSummaries, activeTab]);

  // Calculate stats using all summaries in range, not filtered ones
  const stats = useMemo(() => ({
    summarizedDays: totalSummariesInRange,
    lastCheerfulDay: allSummaries.reduce(
      (best, current) =>
        (!best || (current.rating || 0) > (best.rating || 0)) ? current : best,
      null
    ),
    pinnedCount: allSummaries.filter(summary => summary.is_pinned).length,
    bestDaysCount: allSummaries.filter(summary => summary.is_best_day).length,
  }), [allSummaries, totalSummariesInRange]);

  // Sort summaries
  const sortedSummaries = useMemo(() => {
    return [...filteredSummaries].sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "mood-desc":
          return (b.rating || 0) - (a.rating || 0);
        case "mood-asc":
          return (a.rating || 0) - (b.rating || 0);
        default:
          return 0;
      }
    });
  }, [filteredSummaries, sortBy]);

  const handleTogglePin = async (id: string) => {
    const summary = allSummaries.find(s => s.id === id);
    if (!summary) return;

    const { error } = await supabase
      .from("day_summaries")
      .update({ is_pinned: !summary.is_pinned })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update summary. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: summary.is_pinned ? "Unpinned successfully!" : "Pinned successfully!",
        duration: 2000,
      });
    }
  };

  const handleToggleBestDay = async (id: string) => {
    const summary = allSummaries.find(s => s.id === id);
    if (!summary) return;

    const { error } = await supabase
      .from("day_summaries")
      .update({ is_best_day: !summary.is_best_day })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update summary. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: summary.is_best_day ? "Removed from Best Days" : "Marked as Best Day!",
        duration: 2000,
      });
    }
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
          <h1 className="text-3xl font-bold">Daily Reflections</h1>
          <p className="text-muted-foreground">
            Gain insights from your past to create a better future
          </p>
          <FilterControls
            timeRange={timeRange}
            sortBy={sortBy}
            onTimeRangeChange={setTimeRange}
            onSortByChange={setSortBy}
          />
        </div>

        <StatisticsSection 
          stats={stats}
          onLastCheerfulDayClick={(id) => {
            const summary = allSummaries.find(s => s.id === id);
            if (summary) setSelectedSummary(summary);
          }}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Days</TabsTrigger>
            <TabsTrigger value="pinned">Pinned Days</TabsTrigger>
            <TabsTrigger value="best">Best Days</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <SummaryList
              summaries={sortedSummaries}
              onTogglePin={handleTogglePin}
              onToggleBestDay={handleToggleBestDay}
              onMaximize={setSelectedSummary}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>

        <Dialog open={!!selectedSummary} onOpenChange={() => setSelectedSummary(null)}>
          <DialogContent className="max-w-2xl">
            {selectedSummary && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {getMoodEmoji(selectedSummary.rating)}
                  </span>
                  <h2 className="text-2xl font-semibold">
                    {selectedSummary.title || "Untitled Summary"}
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {selectedSummary.content}
                </p>
                <div className="flex justify-between items-center pt-4">
                  <span className="text-sm text-gray-500">
                    {isToday(new Date(selectedSummary.date)) 
                      ? "Today" 
                      : format(new Date(selectedSummary.date), "MMMM d, yyyy")}
                  </span>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default DaysReview;

