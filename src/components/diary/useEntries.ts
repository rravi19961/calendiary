import { useState, useEffect } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Entry {
  id: string;
  title: string;
  content: string;
  rating: number;
  createdAt: Date;
}

export const useEntries = (date: Date) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadEntries = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("diary_entries")
          .select("*")
          .eq("user_id", user.id)
          .eq("date", format(date, "yyyy-MM-dd"));

        if (error) throw error;

        setEntries(
          data.map((entry) => ({
            id: entry.id,
            title: entry.title || "",
            content: entry.content || "",
            rating: entry.rating || 3,
            createdAt: new Date(entry.created_at),
          }))
        );
      } catch (error) {
        console.error("Error loading entries:", error);
        toast({
          title: "Error",
          description: "Failed to load your entries. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadEntries();
  }, [date, user, toast]);

  return { entries, isLoading, setEntries };
};