import React from "react";
import { motion } from "framer-motion";
import Calendar from "@/components/Calendar";
import MoodTracker from "@/components/MoodTracker";
import EntryModal from "@/components/EntryModal";
import { useTheme } from "@/hooks/useTheme";

const Index = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalKey, setModalKey] = React.useState(Date.now());
  const { theme } = useTheme();

  const handleDateSelect = () => {
    setModalKey(Date.now()); // Force modal re-render
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={`min-h-screen bg-background p-6 ${theme}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <header className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl font-bold mb-2"
          >
            CalenDiary
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-muted-foreground"
          >
            Your personal space for daily reflections
          </motion.p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <Calendar 
            date={selectedDate} 
            setDate={setSelectedDate} 
            onDateSelect={handleDateSelect}
          />
          <MoodTracker />
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