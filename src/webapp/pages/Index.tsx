import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { HeaderSection } from "@/components/diary/HeaderSection";
import EntryModal from "@/components/EntryModal";
import { MainContent } from "@/components/home/MainContent";
import { useEntryState } from "@/components/home/EntryState";
import { QUOTES } from "@/components/diary/constants";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { theme } = useTheme();
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  const {
    entries,
    currentEntryIndex,
    setCurrentEntryIndex,
    currentEntry,
    setCurrentEntry,
    currentTitle,
    setCurrentTitle,
    currentRating,
    setCurrentRating,
    loadEntries,
    handleSaveEntry,
  } = useEntryState(user);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => 
        prevIndex === QUOTES.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
    loadEntries(newDate);
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

      <MainContent
        selectedDate={selectedDate}
        entries={entries}
        currentEntryIndex={currentEntryIndex}
        setCurrentEntryIndex={setCurrentEntryIndex}
        currentEntry={currentEntry}
        setCurrentEntry={setCurrentEntry}
        currentTitle={currentTitle}
        setCurrentTitle={setCurrentTitle}
        currentRating={currentRating}
        setCurrentRating={setCurrentRating}
        onSave={() => handleSaveEntry(selectedDate)}
        onDateChange={handleDateChange}
      />

      <EntryModal
        key={modalKey}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        date={selectedDate}
      />
    </div>
  );
};

export default Index;