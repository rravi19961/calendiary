import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { NewEntryForm } from "./diary/NewEntryForm";

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
}

const EntryModal: React.FC<EntryModalProps> = ({ isOpen, onClose, date }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async (entry: { title: string; content: string; rating: number }) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save entries",
        variant: "destructive",
      });
      return;
    }

    if (!entry.title?.trim() || !entry.content?.trim() || !entry.rating) {
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
        title: entry.title,
        content: entry.content,
        rating: entry.rating,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your diary entry has been saved successfully.",
      });
      onClose();
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
                  New Entry - {format(date, "MMMM d, yyyy")}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="hover:bg-secondary"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <NewEntryForm onSave={handleSave} onCancel={onClose} isSaving={isSaving} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EntryModal;