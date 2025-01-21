import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EntryActionsProps {
  onClose: () => void;
  onSave: () => void;
  onAddNew: () => void;
  isReadOnly: boolean;
  isSaving: boolean;
}

export const EntryActions: React.FC<EntryActionsProps> = ({
  onClose,
  onSave,
  onAddNew,
  isReadOnly,
  isSaving,
}) => {
  return (
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
        <Button variant="outline" onClick={onAddNew} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add New Entry
        </Button>
      )}
    </div>
  );
};