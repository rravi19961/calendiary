import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { SummaryCard } from "@/components/diary/SummaryCard";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Smile, Star, Pin, Calendar } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface DiaryEntry {
  id: string;
  title: string | null;
  content: string | null;
  rating: number | null;
  date: string;
  is_pinned: boolean | null;
  is_best_day: boolean | null;
}

const sortOptions = [
  { value: "date-desc", label: "Newest First" },
  { value: "date-asc", label: "Oldest First" },
  { value: "mood-desc", label: "Best Mood First" },
  { value: "mood-asc", label: "Worst Mood First" },
];

const timeRanges = [
  { value: "7", label: "Last 7 Days" },
  { value: "30", label: "Last 30 Days" },
  { value: "90", label: "Last 90 Days" },
  { value: "all", label: "All Time" },
];

const DaysReview = () => {
  const [timeRange, setTimeRange] = useState("7");
  const [sortBy, setSortBy] = useState("date-desc");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const { toast } = useToast();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["diary-entries", timeRange, activeTab],
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

      if (activeTab === "pinned") {
        query = query.eq("is_pinned", true);
      } else if (activeTab === "best") {
        query = query.eq("is_best_day", true);
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

      return data || [];
    },
  });

  const sortedEntries = [...entries].sort((a, b) => {
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

  const stats = {
    reflectedDays: entries.length,
    lastCheerfulDay: entries.reduce(
      (best, current) =>
        (current.rating || 0) > (best.rating || 0) ? current : best,
      entries[0] || { rating: 0, date: new Date().toISOString() }
    ),
    pinnedCount: entries.filter((entry) => entry.is_pinned).length,
    bestDaysCount: entries.filter((entry) => entry.is_best_day).length,
  };

  const handleTogglePin = async (id: string) => {
    const entry = entries.find((e) => e.id === id);
    if (!entry) return;

    const { error } = await supabase
      .from("diary_entries")
      .update({ is_pinned: !entry.is_pinned })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleBestDay = async (id: string) => {
    const entry = entries.find((e) => e.id === id);
    if (!entry) return;

    const { error } = await supabase
      .from("diary_entries")
      .update({ is_best_day: !entry.is_best_day })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update entry. Please try again.",
        variant: "destructive",
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
          <div className="flex flex-wrap gap-4">
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
            <div className="w-48">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reflected Days</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.reflectedDays}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Cheerful Day</CardTitle>
              <Smile className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.lastCheerfulDay?.rating || 0}/5
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.lastCheerfulDay?.date
                  ? format(new Date(stats.lastCheerfulDay.date), "MMM d, yyyy")
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

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Entries</TabsTrigger>
            <TabsTrigger value="pinned">Pinned Days</TabsTrigger>
            <TabsTrigger value="best">Best Days</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {isLoading ? (
              <div className="grid place-items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedEntries.map((entry) => (
                  <SummaryCard
                    key={entry.id}
                    id={entry.id}
                    title={entry.title || "Untitled Entry"}
                    content={entry.content || ""}
                    date={entry.date}
                    rating={entry.rating || 0}
                    isPinned={entry.is_pinned || false}
                    isBestDay={entry.is_best_day || false}
                    onTogglePin={handleTogglePin}
                    onToggleBestDay={handleToggleBestDay}
                    onMaximize={() => setSelectedEntry(entry)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
          <DialogContent className="max-w-2xl">
            {selectedEntry && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {(() => {
                      switch (selectedEntry.rating) {
                        case 5: return "😍";
                        case 4: return "😊";
                        case 3: return "😐";
                        case 2: return "😟";
                        case 1: return "😭";
                        default: return "😐";
                      }
                    })()}
                  </span>
                  <h2 className="text-2xl font-semibold">
                    {selectedEntry.title || "Untitled Entry"}
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {selectedEntry.content}
                </p>
                <div className="flex justify-between items-center pt-4">
                  <span className="text-sm text-gray-500">
                    {format(new Date(selectedEntry.date), "MMMM d, yyyy")}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTogglePin(selectedEntry.id)}
                    >
                      <Pin className="h-4 w-4 mr-2" />
                      {selectedEntry.is_pinned ? "Unpin" : "Pin"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleBestDay(selectedEntry.id)}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      {selectedEntry.is_best_day ? "Remove Best" : "Mark as Best"}
                    </Button>
                  </div>
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