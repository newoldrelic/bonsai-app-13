import React from 'react';
import { Leaf, Bug, TreeDeciduous } from 'lucide-react';

interface HealthScore {
  category: string;
  score: number;
  icon: React.ReactNode;
  description: string;
}

interface HealthScoresProps {
  scores: HealthScore[];
}

export default function HealthScores({ scores }: HealthScoresProps) {
  const getScoreColor = (score: number) => {
    if (score >= 4) return 'bg-emerald-500';
    if (score >= 3) return 'bg-lime-500';
    if (score >= 2) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {scores.map((item) => (
        <div 
          key={item.category}
          className="bg-white dark:bg-stone-800 rounded-lg p-4 shadow-sm border border-stone-200 dark:border-stone-700"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="text-bonsai-green">
              {item.icon}
            </div>
            <h3 className="font-medium text-stone-900 dark:text-white">
              {item.category}
            </h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-stone-900 dark:text-white">
                {item.score.toFixed(1)}
              </div>
              <div className="text-sm text-stone-500 dark:text-stone-400">
                out of 5.0
              </div>
            </div>
            
            <div className="w-full h-2 bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getScoreColor(item.score)} transition-all`}
                style={{ width: `${(item.score / 5) * 100}%` }}
              />
            </div>
            
            <p className="text-sm text-stone-600 dark:text-stone-300">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}