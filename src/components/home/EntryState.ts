import { useState } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useEntryState = (user: any) => {
  const [entries, setEntries] = useState<any[]>([]);
  const [currentEntryIndex, setCurrentEntryIndex] = useState(0);
  const [currentEntry, setCurrentEntry] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentRating, setCurrentRating] = useState(3);
  const { toast } = useToast();

  const loadEntries = async (date: Date) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("diary_entries")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", format(date, "yyyy-MM-dd"))
        .order("created_at", { ascending: true });

      if (error) throw error;

      setEntries(data || []);
      setCurrentEntryIndex(0);
      
      if (data && data.length > 0) {
        const latestEntry = data[data.length - 1];
        setCurrentEntry(latestEntry.content || "");
        setCurrentTitle(latestEntry.title || "");
        setCurrentRating(latestEntry.rating || 3);
      } else {
        setCurrentEntry("");
        setCurrentTitle("");
        setCurrentRating(3);
      }
    } catch (error) {
      console.error("Error loading entries:", error);
      toast({
        title: "Error",
        description: "Failed to load your entries",
        variant: "destructive",
      });
    }
  };

  const handleSaveEntry = async (selectedDate: Date) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save entries",
        variant: "destructive",
      });
      return;
    }

    try {
      const entryData = {
        user_id: user.id,
        content: currentEntry,
        title: currentTitle,
        rating: currentRating,
        date: format(selectedDate, "yyyy-MM-dd"),
      };

      let operation;
      if (entries.length > 0) {
        operation = supabase
          .from("diary_entries")
          .update(entryData)
          .eq("id", entries[currentEntryIndex].id);
      } else {
        operation = supabase
          .from("diary_entries")
          .insert([entryData]);
      }

      const { error } = await operation;
      if (error) throw error;

      toast({
        title: "Success",
        description: "Your entry has been saved successfully.",
      });

      const { data: updatedEntries, error: fetchError } = await supabase
        .from("diary_entries")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", format(selectedDate, "yyyy-MM-dd"))
        .order("created_at", { ascending: true });

      if (fetchError) throw fetchError;
      setEntries(updatedEntries || []);

    } catch (error) {
      console.error("Error saving entry:", error);
      toast({
        title: "Error",
        description: "Failed to save your entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    entries,
    setEntries,
    currentEntryIndex,
    setCurrentEntryIndex,
    currentEntry,
    setCurrentEntry,
    currentTitle,
    setCurrentTitle,
    currentRating,
    setCurrentRating,
    loadEntries,
    handleSaveEntry,
  };
};