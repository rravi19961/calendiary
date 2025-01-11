import React from "react";
import { Button } from "@/components/ui/button";
import { EntryTitle } from "./EntryTitle";
import { EntryForm } from "./EntryForm";
import { VoiceInput } from "./VoiceInput";

interface NewEntryFormProps {
  onSave: (entry: { title: string; content: string; rating: number }) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export const NewEntryForm: React.FC<NewEntryFormProps> = ({
  onSave,
  onCancel,
  isSaving,
}) => {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [rating, setRating] = React.useState(3);

  const isValid = title.trim() && content.trim() && rating > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSave({ title, content, rating });
    }
  };

  const handleVoiceTranscription = (transcribedText: string) => {
    setContent(prevContent => 
      prevContent ? `${prevContent}\n${transcribedText}` : transcribedText
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <EntryTitle
          title={title}
          onChange={setTitle}
          disabled={false}
        />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Write about your day</label>
            <VoiceInput onTranscriptionComplete={handleVoiceTranscription} />
          </div>
          
          <EntryForm
            content={content}
            rating={rating}
            onChange={({ content: newContent, rating: newRating }) => {
              if (newContent !== undefined) setContent(newContent);
              if (newRating !== undefined) setRating(newRating);
            }}
            disabled={false}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!isValid || isSaving}
        >
          {isSaving ? "Saving..." : "Save Entry"}
        </Button>
      </div>
    </form>
  );
};