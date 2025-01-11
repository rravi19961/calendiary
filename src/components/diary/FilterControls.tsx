import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sortOptions = [
  { value: "date-desc", label: "Newest First" },
  { value: "date-asc", label: "Oldest First" },
  { value: "mood-desc", label: "Best Mood First" },
  { value: "mood-asc", label: "Worst Mood First" },
];

const timeRanges = [
  { value: "7", label: "Last 7 Days" },
  { value: "30", label: "Last 30 Days" },
  { value: "90", label: "Last 90 Days" },
  { value: "all", label: "All Time" },
];

interface FilterControlsProps {
  timeRange: string;
  sortBy: string;
  onTimeRangeChange: (value: string) => void;
  onSortByChange: (value: string) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  timeRange,
  sortBy,
  onTimeRangeChange,
  onSortByChange,
}) => {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="w-48">
        <Select value={timeRange} onValueChange={onTimeRangeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            {timeRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-48">
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};