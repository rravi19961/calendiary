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
  created_at: string;
  image_url?: string | null;
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
        console.log("Fetching entries for date:", format(date, "yyyy-MM-dd"));
        
        const { data, error } = await supabase
          .from("diary_entries")
          .select("*")
          .eq("user_id", user.id)
          .eq("date", format(date, "yyyy-MM-dd"))
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Error fetching entries:", error);
          throw error;
        }

        console.log("Fetched entries:", data);

        setEntries(
          data.map((entry) => ({
            id: entry.id,
            title: entry.title || "",
            content: entry.content || "",
            rating: entry.rating || 3,
            created_at: entry.created_at,
            image_url: entry.image_url,
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