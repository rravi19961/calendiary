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

const Index = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalKey, setModalKey] = React.useState(Date.now());
  const { theme } = useTheme();

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
    <div className={`min-h-screen bg-background ${theme}`}>
      {/* Floating Action Button for New Entry */}
      <Button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 rounded-full shadow-lg z-50"
        size="lg"
      >
        <Plus className="h-5 w-5 mr-2" />
        New Entry
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto p-6 space-y-6"
      >
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Calendar</CardTitle>
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
            <Card>
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

            <Card>
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
            <Card>
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
      </motion.div>
    </div>
  );
};

export default Index;