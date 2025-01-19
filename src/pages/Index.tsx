import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { EntryDisplay } from "@/components/diary/EntryDisplay";
import { HeaderSection } from "@/components/diary/HeaderSection";
import EntryModal from "@/components/EntryModal";
import { CalendarSection } from "@/components/home/CalendarSection";
import { ChatSection } from "@/components/home/ChatSection";
import { DayHighlightsSection } from "@/components/home/DayHighlightsSection";
import { MoodTrendsSection } from "@/components/home/MoodTrendsSection";
import { AppSidebar } from "@/components/AppSidebar";
import { QUOTES } from "@/components/diary/constants";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { theme } = useTheme();
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [currentEntryIndex, setCurrentEntryIndex] = useState(0);
  const { toast } = useToast();
  const [entries, setEntries] = useState<any[]>([]);
  const [currentEntry, setCurrentEntry] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentRating, setCurrentRating] = useState(3);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const loadEntries = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("diary_entries")
          .select("*")
          .eq("user_id", user.id)
          .eq("date", format(selectedDate, "yyyy-MM-dd"))
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

    loadEntries();
  }, [selectedDate, user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => 
        prevIndex === QUOTES.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSaveEntry = async () => {
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
        // Update existing entry
        operation = supabase
          .from("diary_entries")
          .update(entryData)
          .eq("id", entries[currentEntryIndex].id);
      } else {
        // Create new entry
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

      // Reload entries to get the updated data
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

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
    loadEntries(newDate);
  };

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

  const handleNewEntry = () => {
    setModalKey(prev => prev + 1);
    setIsModalOpen(true);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-[#E6F2FA] to-white dark:from-gray-900 dark:to-gray-800 ${theme}`}>
      <div className="flex">
        <AppSidebar onNewEntry={handleNewEntry} />
        <div className="flex-1">
          <HeaderSection 
            currentQuoteIndex={currentQuoteIndex}
            onNewEntry={handleNewEntry}
          />

          <main className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-[600px]">
                <CalendarSection 
                  selectedDate={selectedDate}
                  setSelectedDate={handleDateChange}
                  onDateSelect={() => loadEntries(selectedDate)}
                />
              </div>

              <div className="h-[600px]">
                <EntryDisplay
                  entries={entries}
                  currentEntryIndex={currentEntryIndex}
                  setCurrentEntryIndex={setCurrentEntryIndex}
                  currentEntry={currentEntry}
                  setCurrentEntry={setCurrentEntry}
                  currentTitle={currentTitle}
                  setCurrentTitle={setCurrentTitle}
                  currentRating={currentRating}
                  setCurrentRating={setCurrentRating}
                  selectedDate={selectedDate}
                  onSave={handleSaveEntry}
                  onDateChange={handleDateChange}
                />
              </div>

              <div className="h-[600px]">
                <ChatSection selectedDate={selectedDate} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <MoodTrendsSection />
              <DayHighlightsSection selectedDate={selectedDate} />
            </div>

            <EntryModal
              key={modalKey}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              date={selectedDate}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
