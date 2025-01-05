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
    // Temporarily close modal, then reopen with a new key
    setIsModalOpen(false);
    setTimeout(() => {
      setModalKey(Date.now()); // Update key for re-render
      setIsModalOpen(true);    // Reopen modal
    }, 0);
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Ensure modal is fully closed
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
            setDate={(date) => {
              setSelectedDate(date); // Update selected date
              handleDateSelect();    // Open modal
            }}
          />
          <MoodTracker />
        </div>

        <EntryModal
          key={modalKey}          // Force re-render with a new key
          isOpen={isModalOpen}    // Modal visibility
          onClose={handleModalClose}
          date={selectedDate}     // Pass the selected date
        />
      </motion.div>
    </div>
  );
};

export default Index;