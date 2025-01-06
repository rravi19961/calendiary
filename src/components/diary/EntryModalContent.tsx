import React from "react";
import { Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Entry } from "./useEntries";
import { EntrySlider } from "./EntrySlider";
import { EntryTitle } from "./EntryTitle";
import { useEntryActions } from "./useEntryActions";
import { VoiceRecorder } from "./VoiceRecorder";
import { EntryForm } from "./EntryForm";

interface EntryModalContentProps {
  entries: Entry[];
  setEntries: (entries: Entry[]) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  isReadOnly: boolean;
  onSave: () => void;
  onClose: () => void;
  isSaving: boolean;
}

export const EntryModalContent: React.FC<EntryModalContentProps> = ({
  entries,
  setEntries,
  currentIndex,
  setCurrentIndex,
  isReadOnly,
  onSave,
  onClose,
  isSaving,
}) => {
  const { handleEntryChange } = useEntryActions(entries, setEntries);

  const addNewEntry = () => {
    const newEntry = {
      id: "",
      title: "",
      content: "",
      rating: 3,
      createdAt: new Date(),
    };
    setEntries([...entries, newEntry]);
    setCurrentIndex(entries.length);
  };

  const handleVoiceTranscription = (transcribedText: string) => {
    if (entries.length === 0) {
      addNewEntry();
    }
    handleEntryChange(
      { content: transcribedText },
      entries[currentIndex]?.id || ""
    );
  };

  return (
    <div className="space-y-6">
      {entries.length > 0 ? (
        <>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <EntryTitle
                title={entries[currentIndex]?.title || ""}
                disabled={isReadOnly}
                onChange={(title) =>
                  handleEntryChange({ title }, entries[currentIndex].id)
                }
              />
            </div>
            {!isReadOnly && (
              <VoiceRecorder onTranscriptionComplete={handleVoiceTranscription} />
            )}
          </div>
          <EntrySlider
            entries={entries}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            disabled={isReadOnly}
            onChange={handleEntryChange}
          />
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p className="mb-4">No entries yet for this day.</p>
          <EntryForm
            content=""
            rating={3}
            disabled={false}
            onChange={(changes) => handleEntryChange(changes, "")}
          />
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex justify-between space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={isReadOnly || isSaving}>
            {isSaving ? "Saving..." : "Save Entry"}
          </Button>
        </div>
        
        {!isReadOnly && (
          <Button variant="outline" onClick={addNewEntry} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add New Entry
          </Button>
        )}
      </div>
    </div>
  );
};