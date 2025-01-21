import { Database as DatabaseGenerated } from '@/integrations/supabase/types';

// Export commonly used types
export type Tables<T extends keyof DatabaseGenerated['public']['Tables']> = 
  DatabaseGenerated['public']['Tables'][T]['Row'];
export type Enums<T extends keyof DatabaseGenerated['public']['Enums']> = 
  DatabaseGenerated['public']['Enums'][T];
export type TablesInsert<T extends keyof DatabaseGenerated['public']['Tables']> = 
  DatabaseGenerated['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof DatabaseGenerated['public']['Tables']> = 
  DatabaseGenerated['public']['Tables'][T]['Update'];

// Common table types
export type Profile = Tables<'profiles'>;
export type DiaryEntry = Tables<'diary_entries'>;
export type DaySummary = Tables<'day_summaries'>;
export type ChatHistory = Tables<'chat_history'>;
export type UserPreferences = Tables<'user_preferences'>;

// Insert types
export type ProfileInsert = TablesInsert<'profiles'>;
export type DiaryEntryInsert = TablesInsert<'diary_entries'>;
export type DaySummaryInsert = TablesInsert<'day_summaries'>;
export type ChatHistoryInsert = TablesInsert<'chat_history'>;
export type UserPreferencesInsert = TablesInsert<'user_preferences'>;

// Update types
export type ProfileUpdate = TablesUpdate<'profiles'>;
export type DiaryEntryUpdate = TablesUpdate<'diary_entries'>;
export type DaySummaryUpdate = TablesUpdate<'day_summaries'>;
export type ChatHistoryUpdate = TablesUpdate<'chat_history'>;
export type UserPreferencesUpdate = TablesUpdate<'user_preferences'>;