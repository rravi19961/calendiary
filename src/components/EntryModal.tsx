import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { X, Lock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { QUOTES } from "./diary/constants";
import { useEntries } from "./diary/useEntries";
import { EntrySlider } from "./diary/EntrySlider";

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
  const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0));
  const { entries, setEntries, isLoading } = useEntries(date);
  
  const randomQuote = React.useMemo(
    () => QUOTES[Math.floor(Math.random() * QUOTES.length)],
    [date]
  );

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

    setIsSaving(true);
    try {
      for (const entry of entries) {
        const { error } = await supabase.from("diary_entries").upsert({
          user_id: user.id,
          date: format(date, "yyyy-MM-dd"),
          content: entry.content,
          rating: entry.rating,
        });

        if (error) throw error;
      }

      toast({
        title: "Entries saved",
        description: "Your diary entries have been saved successfully.",
      });
      onClose();
    } catch (error) {
      console.error("Error saving entries:", error);
      toast({
        title: "Error",
        description: "Failed to save your entries. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addNewEntry = () => {
    setEntries([
      ...entries,
      {
        id: String(entries.length + 1),
        content: "",
        rating: 3,
        createdAt: new Date(),
      },
    ]);
    setCurrentIndex(entries.length);
  };

  const handleEntryChange = (
    changes: { content?: string; rating?: number },
    entryId: string
  ) => {
    setEntries(
      entries.map((e) => (e.id === entryId ? { ...e, ...changes } : e))
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
                {isPastDate && <Lock className="h-4 w-4 text-muted-foreground" />}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="hover:bg-secondary"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-primary/10 p-4 rounded-lg mb-6">
              <p className="text-lg italic text-center">{randomQuote}</p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {entries.length > 0 && (
                  <EntrySlider
                    entries={entries}
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                    disabled={isPastDate}
                    onChange={handleEntryChange}
                  />
                )}

                {!isPastDate && (
                  <Button
                    variant="outline"
                    onClick={addNewEntry}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Entry
                  </Button>
                )}

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isPastDate || isSaving}>
                    {isSaving ? "Saving..." : "Save Entries"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EntryModal;