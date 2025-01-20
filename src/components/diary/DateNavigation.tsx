import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, isValid } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DateNavigationProps {
  selectedDate: Date;
  onPrevious: () => void;
  onNext: () => void;
}

export function DateNavigation({
  selectedDate,
  onPrevious,
  onNext,
}: DateNavigationProps) {
  // Ensure we have a valid date, fallback to current date if invalid
  const displayDate = isValid(selectedDate) ? selectedDate : new Date();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Date Navigation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between w-full">
          <Button
            variant="outline"
            size="icon"
            onClick={onPrevious}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium">
            {format(displayDate, "MMMM d, yyyy")}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={onNext}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}