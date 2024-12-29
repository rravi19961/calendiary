import React from "react";
import { motion } from "framer-motion";
import Calendar from "@/components/Calendar";
import MoodTracker from "@/components/MoodTracker";
import EntryModal from "@/components/EntryModal";
import Navbar from "@/components/Navbar";
import { useTheme } from "@/hooks/useTheme";

const Index = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { theme } = useTheme();

  React.useEffect(() => {
    setIsModalOpen(true);
  }, [selectedDate]);

  return (
    <div className={`min-h-screen bg-background p-6 ${theme}`}>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <Calendar date={selectedDate} setDate={setSelectedDate} />
          <MoodTracker />
        </div>

        <EntryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          date={selectedDate}
        />
      </motion.div>
    </div>
  );
};

export default Index;