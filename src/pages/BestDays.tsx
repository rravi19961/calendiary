import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DiaryCard } from "@/components/diary/DiaryCard";
import { useToast } from "@/hooks/use-toast";

const BestDays = () => {
  const { toast } = useToast();

  const { data: bestDays = [], isLoading } = useQuery({
    queryKey: ["best-days"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("diary_entries")
        .select("*")
        .gte("rating", 4)
        .order("date", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load your best days. Please try again.",
          variant: "destructive",
        });
        throw error;
      }

      return data.map(entry => ({
        ...entry,
        date: new Date(entry.date),
      }));
    },
  });

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Best Days</h1>
        </div>

        {isLoading ? (
          <div className="grid place-items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestDays.map((day) => (
              <DiaryCard
                key={day.id}
                title={day.title || "Untitled Entry"}
                content={day.content || ""}
                date={day.date}
                rating={day.rating || 0}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BestDays;