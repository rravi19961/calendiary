import React from "react";
import { motion } from "framer-motion";
import { Plus, Mic, MessageSquare, Calendar as CalendarIcon } from "lucide-react";
import Calendar from "@/components/Calendar";
import MoodTracker from "@/components/MoodTracker";
import EntryModal from "@/components/EntryModal";
import { ChatInterface } from "@/components/ChatInterface";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const QUOTES = [
  "Make each day your masterpiece. - John Wooden",
  "Journaling is a voyage to the interior.",
  "Write what should not be forgotten. - Isabel Allende",
  "Your future self will thank you for your present reflections.",
  "The most beautiful things are those that madness prompts and reason writes. - André Gide",
];

const Index = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalKey, setModalKey] = React.useState(Date.now());
  const [currentQuote, setCurrentQuote] = React.useState(QUOTES[0]);
  const { theme } = useTheme();

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => {
        const currentIndex = QUOTES.indexOf(prev);
        return QUOTES[(currentIndex + 1) % QUOTES.length];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
              <h1 className="text-2xl font-bold text-[#3486CF] dark:text-blue-400">
                CalenDiary
              </h1>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#3486CF] hover:bg-[#2a6ba6]"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Entry
              </Button>
            </div>
            <motion.div
              key={currentQuote}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center text-gray-600 dark:text-gray-300 italic"
            >
              {currentQuote}
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
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
            <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
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

            <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
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
            <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Chat Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <ChatInterface />
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