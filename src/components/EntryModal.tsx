import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { X, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { QUOTES } from "./diary/constants";
import { useEntries } from "./diary/useEntries";
import { EntryModalContent } from "./diary/EntryModalContent";

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
}

const EntryModal: React.FC<EntryModalProps> = ({ isOpen, onClose, date }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const { entries, setEntries, isLoading } = useEntries(date);
  
  const handleClose = () => {
    setCurrentIndex(0);
    setIsSaving(false);
    onClose();
  };

  React.useEffect(() => {
    setCurrentIndex(0);
  }, [date]);

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save entries",
        variant: "destructive",
      });
      return;
    }

    const currentEntry = entries[currentIndex];
    if (!currentEntry?.title?.trim() || !currentEntry?.content?.trim() || !currentEntry?.rating) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Title, Mood, and Description)",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.from("diary_entries").insert({
        user_id: user.id,
        date: format(date, "yyyy-MM-dd"),
        title: currentEntry.title,
        content: currentEntry.content,
        rating: currentEntry.rating,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your diary entry has been saved successfully.",
      });
      handleClose();
    } catch (error) {
      console.error("Error saving entry:", error);
      toast({
        title: "Error",
        description: "Failed to save your entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-card rounded-lg shadow-lg w-full max-w-2xl"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {format(date, "MMMM d, yyyy")}
                </h2>
                <div className="flex items-center space-x-2">
                  {entries.length > 0 && entries[currentIndex]?.id && (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    className="hover:bg-secondary"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <EntryModalContent
                  entries={entries}
                  setEntries={setEntries}
                  currentIndex={currentIndex}
                  setCurrentIndex={setCurrentIndex}
                  isReadOnly={Boolean(entries[currentIndex]?.id)}
                  onSave={handleSave}
                  onClose={handleClose}
                  isSaving={isSaving}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EntryModal;
