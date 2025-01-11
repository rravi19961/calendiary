export const getMoodEmoji = (rating: number | null | undefined): string => {
  if (!rating) return "😐"; // Default for missing data
  
  // Handle decimal values
  const adjustedRating = rating % 1 >= 0.5 ? Math.ceil(rating) : Math.floor(rating);
  
  switch (adjustedRating) {
    case 5: return "😍";
    case 4: return "😊";
    case 3: return "😐";
    case 2: return "😟";
    case 1: return "😭";
    default: return "😐";
  }
};