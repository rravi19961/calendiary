import React, { useState } from "react";
import { Plus, AlertCircle, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import { Entry } from "./useEntries";
import { EntrySlider } from "./EntrySlider";
import { EntryTitle } from "./EntryTitle";
import { useEntryActions } from "./useEntryActions";
import { VoiceRecorder } from "./VoiceRecorder";
import { EntryForm } from "./EntryForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('diary_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('diary_images')
        .getPublicUrl(filePath);

      handleEntryChange(
        { image_url: publicUrl },
        entries[currentIndex].id
      );

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    handleEntryChange(
      { image_url: null },
      entries[currentIndex].id
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
            <div className="relative">
              {entries[currentIndex]?.image_url ? (
                <div className="relative">
                  <img
                    src={entries[currentIndex].image_url}
                    alt="Entry"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                  />
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {isUploading ? "Uploading..." : "Click to upload an image"}
                    </p>
                  </div>
                </div>
              )}
            </div>
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

      <div className="flex flex-col gap-4 mt-auto">
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