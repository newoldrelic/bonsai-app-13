import React from 'react';
import { LineChart, Line, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface HealthData {
  date: string;
  leafCondition: number;
  diseaseAndPests: number;
  overallVigor: number;
}

interface BonsaiHealthChartProps {
  data: HealthData[];
  compact?: boolean;
}

export function BonsaiHealthChart({ data, compact = true }: BonsaiHealthChartProps) {
  // Calculate average health score for each date
  const chartData = data.map(record => ({
    date: record.date,
    avgHealth: (record.leafCondition + record.diseaseAndPests + record.overallVigor) / 3
  }));

  // Sort by date
  chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className={`w-full ${compact ? 'h-12' : 'h-24'}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <Line
            type="monotone"
            dataKey="avgHealth"
            stroke="#2D5A27"
            strokeWidth={2}
            dot={!compact}
            isAnimationActive={false}
          />
          <YAxis
            domain={[0, 5]}
            hide={true}
          />
          {!compact && (
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white dark:bg-stone-800 shadow-lg rounded-lg p-2 text-xs">
                      <p className="font-medium">
                        {new Date(payload[0].payload.date).toLocaleDateString()}
                      </p>
                      <p className="text-bonsai-green">
                        Health Score: {payload[0].value?.toFixed(1)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}