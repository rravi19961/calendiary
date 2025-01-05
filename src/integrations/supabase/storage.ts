import { supabase } from "./client";

export const createAvatarBucket = async () => {
  const { data, error } = await supabase
    .storage
    .createBucket('avatars', {
      public: true,
      fileSizeLimit: 1024 * 1024, // 1MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif']
    });

  if (error) {
    console.error('Error creating avatars bucket:', error);
    return false;
  }
  return true;
};