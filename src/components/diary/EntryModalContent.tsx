import React from "react";
import { Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Entry } from "./useEntries";
import { EntrySlider } from "./EntrySlider";
import { EntryTitle } from "./EntryTitle";
import { useEntryActions } from "./useEntryActions";

interface EntryModalContentProps {
  entries: Entry[];
  setEntries: (entries: Entry[]) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  isPastDate: boolean;
  quote: string;
  onSave: () => void;
  onClose: () => void;
  isSaving: boolean;
}

export const EntryModalContent: React.FC<EntryModalContentProps> = ({
  entries,
  setEntries,
  currentIndex,
  setCurrentIndex,
  isPastDate,
  quote,
  onSave,
  onClose,
  isSaving,
}) => {
  const { handleEntryChange } = useEntryActions(entries, setEntries);

  const addNewEntry = () => {
    const newEntry = {
      id: crypto.randomUUID(),
      title: "",
      content: "",
      rating: 3,
      createdAt: new Date(),
    };
    setEntries([...entries, newEntry]);
    setCurrentIndex(entries.length);
  };

  return (
    <div className="space-y-6">
      {entries.length > 0 ? (
        <>
          {isPastDate && entries[currentIndex]?.id && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This entry is read-only as it was created in the past.
              </AlertDescription>
            </Alert>
          )}
          <EntryTitle
            title={entries[currentIndex]?.title || ""}
            disabled={Boolean(isPastDate && entries[currentIndex]?.id)}
            onChange={(title) =>
              handleEntryChange({ title }, entries[currentIndex].id)
            }
            quote={quote}
          />
          <EntrySlider
            entries={entries}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            disabled={Boolean(isPastDate && entries[currentIndex]?.id)}
            onChange={handleEntryChange}
          />
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No entries yet. Click the button below to add one.
        </div>
      )}

      <Button
        variant="outline"
        onClick={addNewEntry}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add New Entry
      </Button>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={onSave} 
          disabled={Boolean(isPastDate && entries[currentIndex]?.id) || isSaving}
        >
          {isSaving ? "Saving..." : "Save Entry"}
        </Button>
      </div>
    </div>
  );
};