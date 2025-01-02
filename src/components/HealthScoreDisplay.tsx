import React from 'react';
import { Leaf, Bug, TreeDeciduous } from 'lucide-react';

interface HealthScoreDisplayProps {
  score: number;
  leafScore: number;
  pestScore: number;
  vigorScore: number;
  date: string;
}

export function HealthScoreDisplay({ score, leafScore, pestScore, vigorScore, date }: HealthScoreDisplayProps) {
  const getHealthColor = (value: number) => {
    if (value >= 4) return 'text-emerald-500 from-emerald-500';
    if (value >= 3) return 'text-lime-500 from-lime-500';
    if (value >= 2) return 'text-yellow-500 from-yellow-500';
    return 'text-red-500 from-red-500';
  };

  const getProgressColor = (value: number) => {
    if (value >= 4) return 'bg-emerald-500';
    if (value >= 3) return 'bg-lime-500';
    if (value >= 2) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const calculateRotation = (value: number) => {
    return (value / 5) * 360; // Convert score to degrees (max score is 5)
  };

  return (
    <div className="p-4 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-medium text-stone-600 dark:text-stone-300">
          Health Score
        </h4>
        <span className="text-xs text-stone-400">
          {new Date(date).toLocaleDateString()}
        </span>
      </div>

      <div className="flex items-center justify-between">
        {/* Main score circle */}
        <div className="relative w-16 h-16">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-stone-200 dark:text-stone-700"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={`${(calculateRotation(score) / 360) * (2 * Math.PI * 28)} ${2 * Math.PI * 28}`}
              className={`${getHealthColor(score)} transition-all duration-500`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-lg font-bold ${getHealthColor(score)}`}>
              {score.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Individual metrics */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Leaf, score: leafScore, label: 'Leaves' },
            { icon: Bug, score: pestScore, label: 'Pests' },
            { icon: TreeDeciduous, score: vigorScore, label: 'Vigor' }
          ].map(({ icon: Icon, score: metricScore, label }) => (
            <div key={label} className="relative">
              <div className="w-12 h-12 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-bonsai-green" />
                  </div>
                </div>
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-stone-200 dark:text-stone-700"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray={`${(calculateRotation(metricScore) / 360) * (2 * Math.PI * 20)} ${2 * Math.PI * 20}`}
                    className={getProgressColor(metricScore)}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center mt-8">
                  <span className="text-xs font-medium text-stone-600 dark:text-stone-300">
                    {metricScore.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}