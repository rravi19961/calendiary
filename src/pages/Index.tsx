import React from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "@/components/Calendar";
import MoodTracker from "@/components/MoodTracker";
import { ChatInterface } from "@/components/ChatInterface";
import { useTheme } from "@/hooks/useTheme";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QUOTES } from "@/components/diary/constants";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { EntryDisplay } from "@/components/diary/EntryDisplay";
import { HeaderSection } from "@/components/diary/HeaderSection";
import EntryModal from "@/components/EntryModal";

const Index = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const { theme } = useTheme();
  const [currentQuoteIndex, setCurrentQuoteIndex] = React.useState(0);
  const [currentEntryIndex, setCurrentEntryIndex] = React.useState(0);
  const { toast } = useToast();
  const [entries, setEntries] = React.useState<any[]>([]);
  const [currentEntry, setCurrentEntry] = React.useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalKey, setModalKey] = React.useState(0);

  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

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

  const handleNewEntry = () => {
    setModalKey(prev => prev + 1);
    setIsModalOpen(true);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-[#E6F2FA] to-white dark:from-gray-900 dark:to-gray-800 ${theme}`}>
      <HeaderSection 
        currentQuoteIndex={currentQuoteIndex}
        onNewEntry={handleNewEntry}
      />

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
            <EntryDisplay
              entries={entries}
              currentEntryIndex={currentEntryIndex}
              setCurrentEntryIndex={setCurrentEntryIndex}
              currentEntry={currentEntry}
              setCurrentEntry={setCurrentEntry}
              selectedDate={selectedDate}
            />
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