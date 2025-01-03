import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { X, Lock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface Entry {
  id: string;
  content: string;
  rating: number;
  createdAt: Date;
}

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
}

const QUOTES = [
  "Write it on your heart that every day is the best day in the year.",
  "Today is the first day of the rest of your life.",
  "Make each day your masterpiece.",
];

const EMOJIS = ["😢", "😕", "😐", "🙂", "😊"];

const EntryModal: React.FC<EntryModalProps> = ({ isOpen, onClose, date }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [entries, setEntries] = React.useState<Entry[]>([
    { id: "1", content: "", rating: 3, createdAt: new Date() },
  ]);
  const [isSaving, setIsSaving] = React.useState(false);
  const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0));
  const randomQuote = React.useMemo(
    () => QUOTES[Math.floor(Math.random() * QUOTES.length)],
    [date]
  );

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
      // Save each entry to the database
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
  };

  const handleContentChange = (id: string, value: string) => {
    if (value.length <= 500) {
      setEntries(
        entries.map((entry) =>
          entry.id === id ? { ...entry, content: value } : entry
        )
      );
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
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

            <div className="space-y-6">
              {entries.map((entry, index) => (
                <div key={entry.id} className="space-y-4">
                  {index > 0 && (
                    <div className="border-t border-border pt-4"></div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      How was your day? {EMOJIS[Math.floor(entry.rating) - 1]}
                    </label>
                    <Slider
                      value={[entry.rating]}
                      min={1}
                      max={5}
                      step={1}
                      disabled={isPastDate}
                      onValueChange={(value) =>
                        setEntries(
                          entries.map((e) =>
                            e.id === entry.id ? { ...e, rating: value[0] } : e
                          )
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Write about your day
                      <span className="text-xs text-muted-foreground ml-2">
                        ({500 - entry.content.length} characters remaining)
                      </span>
                    </label>
                    <Textarea
                      value={entry.content}
                      onChange={(e) =>
                        handleContentChange(entry.id, e.target.value)
                      }
                      disabled={isPastDate}
                      placeholder="What happened today?"
                      className="min-h-[150px]"
                    />
                  </div>
                </div>
              ))}

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
                <Button
                  onClick={handleSave}
                  disabled={isPastDate || isSaving}
                >
                  {isSaving ? "Saving..." : "Save Entries"}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EntryModal;