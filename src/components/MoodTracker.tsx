import React from "react";
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
  );
};

export default MoodTracker;