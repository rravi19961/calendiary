import { Entry } from "./useEntries";

export const useEntryActions = (entries: Entry[], setEntries: (entries: Entry[]) => void) => {
  const handleEntryChange = (
    changes: Partial<Entry>,
    entryId: string
  ) => {
    setEntries(
      entries.map((entry) =>
        entry.id === entryId ? { ...entry, ...changes } : entry
      )
    );
  };

  return { handleEntryChange };
};