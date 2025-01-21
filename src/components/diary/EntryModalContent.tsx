import React from "react";
import { format } from "date-fns";
import { Entry } from "./useEntries";
import { EntrySlider } from "./EntrySlider";
import { EntryTitle } from "./EntryTitle";
import { useEntryActions } from "./useEntryActions";
import { VoiceRecorder } from "./VoiceRecorder";
import { EntryForm } from "./EntryForm";
import { EntryImageUpload } from "./EntryImageUpload";
import { EntryActions } from "./EntryActions";

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
    <div className="space-y-6 h-full flex flex-col">
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
              <p className="text-sm text-muted-foreground mt-1">
                {format(new Date(entries[currentIndex]?.createdAt), 'h:mm a')}
              </p>
            </div>
            {!isReadOnly && (
              <VoiceRecorder onTranscriptionComplete={handleVoiceTranscription} />
            )}
          </div>

          {!isReadOnly && (
            <EntryImageUpload
              imageUrl={entries[currentIndex]?.image_url}
              onImageChange={(url) =>
                handleEntryChange({ image_url: url }, entries[currentIndex].id)
              }
              disabled={isReadOnly}
            />
          )}

          <div className="flex-grow">
            <EntrySlider
              entries={entries}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              disabled={isReadOnly}
              onChange={handleEntryChange}
            />
          </div>
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

      <EntryActions
        onClose={onClose}
        onSave={onSave}
        onAddNew={addNewEntry}
        isReadOnly={isReadOnly}
        isSaving={isSaving}
      />
    </div>
  );
};