import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";

export const useDayMood = (selectedDate: Date) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["day-mood", selectedDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("day_summaries")
        .select("rating")
        .eq("user_id", user?.id)
        .eq("date", format(selectedDate, "yyyy-MM-dd"))
        .maybeSingle();

      if (error) throw error;
      return data?.rating ?? 3; // Default to neutral mood if no rating exists
    },
  });
};