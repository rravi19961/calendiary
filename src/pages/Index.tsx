import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { QUOTES } from "@/components/diary/constants";
import { MainLayout } from "@/components/home/MainLayout";
import { useEntriesManager } from "@/hooks/useEntries";

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
    handleSaveEntry,
  } = useEntriesManager(selectedDate);

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

  const handleNewEntry = () => {
    setModalKey(prev => prev + 1);
    setIsModalOpen(true);
  };

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  return (
    <div className={theme}>
      <MainLayout
        selectedDate={selectedDate}
        currentQuoteIndex={currentQuoteIndex}
        onNewEntry={handleNewEntry}
        onDateChange={handleDateChange}
        entries={entries}
        currentEntryIndex={currentEntryIndex}
        setCurrentEntryIndex={setCurrentEntryIndex}
        currentEntry={currentEntry}
        setCurrentEntry={setCurrentEntry}
        currentTitle={currentTitle}
        setCurrentTitle={setCurrentTitle}
        currentRating={currentRating}
        setCurrentRating={setCurrentRating}
        onSave={handleSaveEntry}
        isModalOpen={isModalOpen}
        onCloseModal={() => setIsModalOpen(false)}
        modalKey={modalKey}
      />
    </div>
  );
};

export default Index;