import React from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Star } from "lucide-react";

interface MoodData {
  date: string;
  rating: number;
}

const mockData: MoodData[] = [
  { date: "Mon", rating: 4 },
  { date: "Tue", rating: 3 },
  { date: "Wed", rating: 5 },
  { date: "Thu", rating: 4 },
  { date: "Fri", rating: 4 },
  { date: "Sat", rating: 5 },
  { date: "Sun", rating: 4 },
];

const MOOD_EMOJIS = ["😢", "☹️", "😐", "🙂", "😄"];

const MoodTracker: React.FC = () => {
  const CustomYAxisTick = ({ x, y, payload }: any) => {
    const emojiIndex = payload.value - 1;
    return (
      <text x={x} y={y} dy={5} textAnchor="end" fontSize={16}>
        {MOOD_EMOJIS[emojiIndex]}
      </text>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="neo-card p-6 w-full max-w-sm mx-auto mt-6"
    >
      <div className="flex items-center space-x-2 mb-4">
        <Star className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Mood Trends</h2>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockData}>
            <XAxis dataKey="date" />
            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tick={<CustomYAxisTick />}
            />
            <Tooltip
              formatter={(value: number) => [
                `Mood: ${MOOD_EMOJIS[value - 1]}`,
                "",
              ]}
            />
            <Line
              type="monotone"
              dataKey="rating"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default MoodTracker;