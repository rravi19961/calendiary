export const getMoodEmoji = (rating: number | null | undefined): string => {
  if (!rating) return "😐"; // Default for missing data
  
  // Handle decimal values with proper rounding logic
  const adjustedRating = rating % 1 >= 0.5 ? Math.ceil(rating) : Math.floor(rating);
  
  switch (adjustedRating) {
    case 5: return "😍"; // Super Happy
    case 4: return "😊"; // Happy
    case 3: return "😐"; // Neutral
    case 2: return "😟"; // Sad
    case 1: return "😭"; // Very Sad
    default: return "😐";
  }
};