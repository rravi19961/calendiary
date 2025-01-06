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
import { QUOTES } from "@/components/diary/constants";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { theme } = useTheme();
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [currentEntryIndex, setCurrentEntryIndex] = useState(0);
  const { toast } = useToast();
  const [entries, setEntries] = useState<any[]>([]);
  const [currentEntry, setCurrentEntry] = useState("");
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
        
        // If it's today, set the current entry to the latest entry's content or empty
        if (isToday(selectedDate)) {
          setCurrentEntry(data?.[data.length - 1]?.content || "");
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
      const { error } = await supabase.from("diary_entries").upsert({
        user_id: user.id,
        content: currentEntry,
        date: format(selectedDate, "yyyy-MM-dd"),
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your entry has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving entry:", error);
      toast({
        title: "Error",
        description: "Failed to save your entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-[#E6F2FA] to-white dark:from-gray-900 dark:to-gray-800 ${theme}`}>
      <HeaderSection 
        currentQuoteIndex={currentQuoteIndex}
        onNewEntry={() => {
          setModalKey(prev => prev + 1);
          setIsModalOpen(true);
        }}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <CalendarSection 
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </div>

          {/* Center Column */}
          <div className="space-y-6">
            <EntryDisplay
              entries={entries}
              currentEntryIndex={currentEntryIndex}
              setCurrentEntryIndex={setCurrentEntryIndex}
              currentEntry={currentEntry}
              setCurrentEntry={setCurrentEntry}
              selectedDate={selectedDate}
              onSave={handleSaveEntry}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <ChatSection />
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
  );
};

export default Index;