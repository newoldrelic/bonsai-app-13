import React from 'react';
import { Activity } from 'lucide-react';

interface CircularHealthScoreProps {
  score: number;
  date: string;
}

export function CircularHealthScore({ score, date }: CircularHealthScoreProps) {
  const getHealthColor = (value: number) => {
    if (value >= 4) return 'text-emerald-500 from-emerald-500';
    if (value >= 3) return 'text-lime-500 from-lime-500';
    if (value >= 2) return 'text-yellow-500 from-yellow-500';
    return 'text-red-500 from-red-500';
  };

  const calculateRotation = (value: number) => {
    return (value / 5) * 360; // Convert score to degrees (max score is 5)
  };

  return (
    <div className="p-4 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-bonsai-green" />
          <span className="text-sm font-medium text-stone-600 dark:text-stone-300">
            Health Score
          </span>
        </div>
        <span className="text-xs text-stone-400">
          {new Date(date).toLocaleDateString()}
        </span>
      </div>

      <div className="flex items-center justify-center py-2">
        <div className="relative w-20 h-20">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-stone-200 dark:text-stone-700"
            />
            {/* Animated progress circle */}
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={`${(calculateRotation(score) / 360) * (2 * Math.PI * 36)} ${2 * Math.PI * 36}`}
              className={`${getHealthColor(score)} transition-all duration-1000 ease-out`}
              style={{ strokeDashoffset: 0 }}
            />
          </svg>
          {/* Score text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${getHealthColor(score)}`}>
              {score.toFixed(1)}
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400">out of 5</span>
          </div>
        </div>
      </div>
    </div>
  );
}