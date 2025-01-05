import React from "react";
import { motion } from "framer-motion";
import { Plus, Mic, MessageSquare } from "lucide-react";
import Calendar from "@/components/Calendar";
import MoodTracker from "@/components/MoodTracker";
import EntryModal from "@/components/EntryModal";
import { ChatInterface } from "@/components/ChatInterface";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QUOTES } from "@/components/diary/constants";

const Index = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalKey, setModalKey] = React.useState(Date.now());
  const { theme } = useTheme();
  const [currentQuoteIndex, setCurrentQuoteIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => 
        prevIndex === QUOTES.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change quote every 5 seconds

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

  const handleDateSelect = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setModalKey(Date.now());
      setIsModalOpen(true);
    }, 0);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Calendar</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar 
                  date={selectedDate} 
                  setDate={(date) => {
                    setSelectedDate(date);
                    handleDateSelect();
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Center Column */}
          <div className="space-y-6">
            <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Today's Entry</CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" title="Record Audio">
                    <Mic className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Open Chat">
                    <MessageSquare className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Click "New Entry" to start writing about your day...
                </p>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Mood Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <MoodTracker />
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

        <EntryModal
          key={modalKey}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          date={selectedDate}
        />
      </main>
    </div>
  );
};

export default Index;