import React, { useState } from "react";
import { format } from "date-fns";
import { Maximize2, X, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { EntryContent } from "./EntryContent";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Entry {
  id: string;
  title: string;
  content: string;
  rating: number;
  created_at: string;
  image_url?: string | null;
}

interface EntryMaximizeModalProps {
  entries: Entry[];
  currentEntryIndex: number;
  setCurrentEntryIndex: (index: number) => void;
  currentEntry: string;
  setCurrentEntry: (content: string) => void;
  currentTitle: string;
  setCurrentTitle: (title: string) => void;
  currentRating: number;
  setCurrentRating: (rating: number) => void;
  selectedDate: Date;
  onSave: () => void;
}

export const EntryMaximizeModal: React.FC<EntryMaximizeModalProps> = ({
  entries,
  currentEntryIndex,
  setCurrentEntryIndex,
  currentEntry,
  setCurrentEntry,
  currentTitle,
  setCurrentTitle,
  currentRating,
  setCurrentRating,
  selectedDate,
  onSave,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const isCurrentDay = format(new Date(), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");

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

      const { error: updateError } = await supabase
        .from('diary_entries')
        .update({ image_url: publicUrl })
        .eq('id', entries[currentEntryIndex].id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });

      // Update the local entries array
      const updatedEntries = [...entries];
      updatedEntries[currentEntryIndex] = {
        ...updatedEntries[currentEntryIndex],
        image_url: publicUrl,
      };
      
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

  const handleRemoveImage = async () => {
    try {
      const { error } = await supabase
        .from('diary_entries')
        .update({ image_url: null })
        .eq('id', entries[currentEntryIndex].id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Image removed successfully",
      });

      // Update the local entries array
      const updatedEntries = [...entries];
      updatedEntries[currentEntryIndex] = {
        ...updatedEntries[currentEntryIndex],
        image_url: null,
      };
      
    } catch (error) {
      console.error('Error removing image:', error);
      toast({
        title: "Error",
        description: "Failed to remove image",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsOpen(true)}
        className="absolute bottom-4 right-4 hover:bg-blue-100 dark:hover:bg-blue-900 transition-transform hover:scale-105"
      >
        <Maximize2 className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 gap-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
          <div className="h-[90vh] flex flex-col sm:flex-row relative">
            {/* Left Panel - Entry Titles */}
            <div className="w-full sm:w-1/3 border-r border-blue-100 dark:border-blue-900">
              <div className="p-6 border-b border-blue-100 dark:border-blue-900">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">
                    Entries for {format(selectedDate, "MMMM d, yyyy")}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-blue-100 dark:hover:bg-blue-900"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-[calc(90vh-5rem)]">
                <div className="p-4 space-y-2">
                  {entries.map((entry, index) => (
                    <div key={entry.id}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          "hover:bg-blue-100/50 dark:hover:bg-blue-900/30",
                          index === currentEntryIndex && "bg-blue-200/70 dark:bg-blue-800/70"
                        )}
                        onClick={() => setCurrentEntryIndex(index)}
                      >
                        <div className="flex flex-col w-full">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(entry.created_at), "h:mm a")}
                            </span>
                            <span className="font-medium">{entry.title || "Untitled Entry"}</span>
                          </div>
                        </div>
                      </Button>
                      <Separator className="my-2" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Right Panel - Entry Content */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6">
                  {/* Image Upload Section */}
                  <div className="space-y-4">
                    {entries[currentEntryIndex]?.image_url ? (
                      <div className="relative">
                        <img
                          src={entries[currentEntryIndex].image_url}
                          alt="Entry"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={handleRemoveImage}
                        >
                          <Trash2 className="h-4 w-4" />
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

                  {/* Entry Content */}
                  <EntryContent
                    title={currentTitle}
                    content={currentEntry}
                    rating={currentRating}
                    isCurrentDay={isCurrentDay}
                    onTitleChange={setCurrentTitle}
                    onContentChange={setCurrentEntry}
                    onRatingChange={setCurrentRating}
                    onSave={onSave}
                    hideTitle
                  />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};