import React from 'react';
import { X, Activity, TreeDeciduous } from 'lucide-react';
import { BonsaiHealthChart } from './BonsaiHealthChart';
import type { BonsaiTree } from '../types';

interface HealthRecord {
  date: string;
  leafCondition: number;
  diseaseAndPests: number;
  overallVigor: number;
}

interface HealthHistoryModalProps {
  tree: BonsaiTree;
  healthRecords: HealthRecord[];
  onClose: () => void;
  onAnalyze: () => void;
}

export function HealthHistoryModal({ tree, healthRecords, onClose, onAnalyze }: HealthHistoryModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-stone-800 rounded-xl shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-700">
          <h2 className="text-lg font-semibold text-bonsai-bark dark:text-white">
            {tree.name} - Health History
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {healthRecords.length > 0 ? (
            <>
              <div className="h-64">
                <BonsaiHealthChart data={healthRecords} compact={false} />
              </div>

              <div className="space-y-4">
                {healthRecords.map((record, index) => (
                  <div 
                    key={record.date} 
                    className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-lg space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                      <span className="text-sm text-stone-500">
                        Health Check #{healthRecords.length - index}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-stone-500">Leaf Condition</p>
                        <p className="font-medium">{record.leafCondition.toFixed(1)}/5.0</p>
                      </div>
                      <div>
                        <p className="text-sm text-stone-500">Disease & Pests</p>
                        <p className="font-medium">{record.diseaseAndPests.toFixed(1)}/5.0</p>
                      </div>
                      <div>
                        <p className="text-sm text-stone-500">Overall Vigor</p>
                        <p className="font-medium">{record.overallVigor.toFixed(1)}/5.0</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <TreeDeciduous className="w-16 h-16 text-bonsai-green/30 mx-auto mb-4" />
              <p className="text-stone-600 dark:text-stone-400 mb-4">
                No health records available yet.
              </p>
            </div>
          )}

          <button
            onClick={onAnalyze}
            className="w-full bg-bonsai-green text-white px-4 py-2 rounded-lg hover:bg-bonsai-moss transition-colors flex items-center justify-center space-x-2"
          >
            <Activity className="w-5 h-5" />
            <span>Run New Health Check</span>
          </button>
        </div>
      </div>
    </div>
  );
}