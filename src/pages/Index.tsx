import React from "react";
import { motion } from "framer-motion";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import Calendar from "@/components/Calendar";
import MoodTracker from "@/components/MoodTracker";
import EntryModal from "@/components/EntryModal";
import { ChatInterface } from "@/components/ChatInterface";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QUOTES } from "@/components/diary/constants";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";

interface Entry {
  id: string;
  title: string;
  content: string;
  rating: number;
  created_at: string;
}

const Index = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalKey, setModalKey] = React.useState(Date.now());
  const { theme } = useTheme();
  const [currentQuoteIndex, setCurrentQuoteIndex] = React.useState(0);
  const [currentEntryIndex, setCurrentEntryIndex] = React.useState(0);
  const { toast } = useToast();
  const [entries, setEntries] = React.useState<Entry[]>([]);
  const [currentEntry, setCurrentEntry] = React.useState("");
  const { user } = useAuth();

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => 
        prevIndex === QUOTES.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const { data: chatStarters = [] } = useQuery({
    queryKey: ["chat-starters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chat_starters")
        .select("*")
        .order("created_at");

      if (error) throw error;
      return data;
    },
  });

  const { data: dayResponses = [] } = useQuery({
    queryKey: ["day-responses", selectedDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("question_responses")
        .select(`
          *,
          daily_questions (question_text),
          question_choices (choice_text)
        `)
        .eq("date", format(selectedDate, "yyyy-MM-dd"));

      if (error) throw error;
      return data;
    },
  });

  const fetchEntries = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to view entries",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase
      .from("diary_entries")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", format(selectedDate, "yyyy-MM-dd"))
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching entries:", error);
      return;
    }

    setEntries(data || []);
    setCurrentEntryIndex(0);
    setCurrentEntry(data?.[0]?.content || "");
  };

  React.useEffect(() => {
    fetchEntries();
  }, [selectedDate, user]);

  const handleSaveEntry = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save entries",
        variant: "destructive",
      });
      return;
    }

    const entry = entries[currentEntryIndex];
    const { error } = await supabase
      .from("diary_entries")
      .upsert({
        id: entry?.id,
        user_id: user.id,
        date: format(selectedDate, "yyyy-MM-dd"),
        content: currentEntry,
        title: entry?.title || "Untitled Entry",
        rating: entry?.rating || 3,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save entry. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Your entry has been saved.",
    });

    fetchEntries();
  };

  const handleNewEntry = () => {
    setEntries([...entries, {
      id: "",
      title: "Untitled Entry",
      content: "",
      rating: 3,
      created_at: new Date().toISOString(),
    }]);
    setCurrentEntryIndex(entries.length);
    setCurrentEntry("");
  };

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-b from-[#E6F2FA] to-white dark:from-gray-900 dark:to-gray-800",
      theme
    )}>
      {/* Header */}
      <header className="bg-gradient-to-r from-[#E6F2FA] to-[#F8F8F8] dark:from-gray-900 dark:to-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <motion.p 
                className="text-lg text-gray-600 dark:text-gray-300 italic"
                key={currentQuoteIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {QUOTES[currentQuoteIndex]}
              </motion.p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#3486CF] hover:bg-[#2a6ba6]"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Entry
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Calendar</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar 
                  date={selectedDate} 
                  setDate={setSelectedDate}
                />
              </CardContent>
            </Card>
          </div>

          {/* Center Column */}
          <div className="space-y-6">
            <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Today's Entry</CardTitle>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setCurrentEntryIndex(Math.max(0, currentEntryIndex - 1))}
                    disabled={currentEntryIndex === 0}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {currentEntryIndex + 1} of {entries.length}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setCurrentEntryIndex(Math.min(entries.length - 1, currentEntryIndex + 1))}
                    disabled={currentEntryIndex === entries.length - 1}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={currentEntry}
                  onChange={(e) => setCurrentEntry(e.target.value)}
                  placeholder="Write about your day..."
                  className="min-h-[200px]"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleNewEntry}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Entry
                  </Button>
                  <Button onClick={handleSaveEntry}>
                    Save Entry
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Chat Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <ChatInterface chatStarters={chatStarters} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Bottom Left */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Mood Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <MoodTracker />
            </CardContent>
          </Card>

          {/* Bottom Right */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Your Day Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dayResponses.map((response: any) => (
                  <div key={response.id} className="space-y-1">
                    <p className="font-medium">Q: {response.daily_questions?.question_text}</p>
                    <p className="text-muted-foreground">
                      A: {response.question_choices?.choice_text || response.other_text}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
