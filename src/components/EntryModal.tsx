import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { X, Lock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

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
  // Add more quotes as needed
];

const EntryModal: React.FC<EntryModalProps> = ({ isOpen, onClose, date }) => {
  const { toast } = useToast();
  const [entries, setEntries] = React.useState<Entry[]>([
    { id: "1", content: "", rating: 0, createdAt: new Date() },
  ]);
  const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0));
  const randomQuote = React.useMemo(
    () => QUOTES[Math.floor(Math.random() * QUOTES.length)],
    [date]
  );

  const handleSave = () => {
    toast({
      title: "Entries saved",
      description: "Your diary entries have been saved successfully.",
    });
    onClose();
  };

  const addNewEntry = () => {
    setEntries([
      ...entries,
      {
        id: String(entries.length + 1),
        content: "",
        rating: 0,
        createdAt: new Date(),
      },
    ]);
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
          className="bg-background rounded-lg shadow-lg w-full max-w-2xl"
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
                      How was your day? (1-5)
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Button
                          key={value}
                          variant={entry.rating === value ? "default" : "outline"}
                          onClick={() =>
                            setEntries(
                              entries.map((e) =>
                                e.id === entry.id
                                  ? { ...e, rating: value }
                                  : e
                              )
                            )
                          }
                          disabled={isPastDate}
                          className="w-10 h-10 rounded-full"
                        >
                          {value}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Write about your day
                    </label>
                    <Textarea
                      value={entry.content}
                      onChange={(e) =>
                        setEntries(
                          entries.map((ent) =>
                            ent.id === entry.id
                              ? { ...ent, content: e.target.value }
                              : ent
                          )
                        )
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
                <Button onClick={handleSave} disabled={isPastDate}>
                  Save Entries
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