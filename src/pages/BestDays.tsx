import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BestDay {
  date: Date;
  rating: number;
  content: string;
}

const BestDays = () => {
  const [sortBy, setSortBy] = React.useState("date");
  const [bestDays, setBestDays] = React.useState<BestDay[]>([
    {
      date: new Date(),
      rating: 5,
      content: "Example best day entry",
    },
  ]);

  const sortedDays = React.useMemo(() => {
    return [...bestDays].sort((a, b) => {
      if (sortBy === "date") {
        return b.date.getTime() - a.date.getTime();
      }
      return b.rating - a.rating;
    });
  }, [bestDays, sortBy]);

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Best Days</h1>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Sort by Date</SelectItem>
              <SelectItem value="rating">Sort by Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="w-[50%]">Entry</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedDays.map((day, index) => (
              <TableRow key={index}>
                <TableCell>{format(day.date, "PPP")}</TableCell>
                <TableCell>{day.rating}/5</TableCell>
                <TableCell className="truncate">{day.content}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
};

export default BestDays;