import React, { useState, useEffect } from 'react';
import { Calendar, Droplets, TreeDeciduous, Edit2, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { ImageUpload } from './ImageUpload';
import { CircularHealthScore } from './CircularHealthScore';
import { HealthScoreMenu } from './HealthScoreMenu';
import type { BonsaiTree } from '../types';
import { HealthHistoryModal } from './HealthHistoryModal';

interface BonsaiCardProps {
  tree: BonsaiTree;
  onClick: (id: string) => void;
  onEdit: (id: string) => void;
}

interface HealthRecord {
  date: string;
  leafCondition: number;
  diseaseAndPests: number;
  overallVigor: number;
}

export function BonsaiCard({ tree, onClick, onEdit }: BonsaiCardProps) {
  const navigate = useNavigate();
  const { getCurrentPlan } = useSubscriptionStore();
  const currentPlan = getCurrentPlan();
  const isSubscribed = currentPlan !== 'hobby';
  const [isHovering, setIsHovering] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealthRecords = async () => {
      try {
        const healthRecordRef = doc(db, 'healthRecords', tree.id);
        const docSnap = await getDoc(healthRecordRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const records = data.records || [];
          const sortedRecords = [...records].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setHealthRecords(sortedRecords);
        } else {
          setHealthRecords([]);
        }
      } catch (error) {
        console.error('Error fetching health records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthRecords();
  }, [tree.id]);

  const handleHealthCheck = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!isSubscribed) {
      navigate('/pricing');
      return;
    }
    setShowUploadModal(true);
  };

  const handleImageCapture = (imageData: string) => {
    setShowUploadModal(false);
    navigate('/health-analytics', { 
      state: { 
        treeId: tree.id,
        treeName: tree.name,
        treeImage: imageData
      } 
    });
  };

  const handleHealthHistoryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowHealthModal(true);
  };

  const getLatestHealthScore = () => {
    if (!healthRecords.length) return null;
    const latest = healthRecords[0];
    return {
      score: (latest.leafCondition + latest.diseaseAndPests + latest.overallVigor) / 3,
      date: latest.date
    };
  };

  const latestScore = getLatestHealthScore();

  return (
    <>
      <div 
        className="card overflow-hidden hover:scale-[1.02] transition-transform"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div onClick={() => onClick(tree.id)} className="cursor-pointer">
          {/* Image Section */}
          <div className="relative h-40 sm:h-48 overflow-hidden">
            {tree.images[0] ? (
              <img 
                src={tree.images[0]} 
                alt={tree.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                <TreeDeciduous className="w-12 h-12 sm:w-16 sm:h-16 text-bonsai-green opacity-50" />
              </div>
            )}
            <div className="absolute top-3 right-3 bg-bonsai-terra text-white text-xs px-2 py-1 rounded-full">
              {tree.style}
            </div>
          </div>
          
          {/* Content Section */}
          <div className="p-4 sm:p-5">
            <div className="mb-3">
              <h3 className="font-display text-lg font-semibold text-bonsai-bark dark:text-white truncate">
                {tree.name}
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400 truncate">
                {tree.species}
              </p>
            </div>

            {/* Health Score Section */}
            <div className="mb-4 relative group">
              {loading ? (
                <div className="h-24 bg-stone-100 dark:bg-stone-800 rounded animate-pulse" />
              ) : healthRecords.length > 0 && latestScore ? (
                <>
                  <CircularHealthScore
                    score={latestScore.score}
                    date={latestScore.date}
                  />
                  <HealthScoreMenu
                    onViewHistory={handleHealthHistoryClick}
                    onRunCheck={handleHealthCheck}
                  />
                </>
              ) : (
                <div 
                  onClick={handleHealthCheck}
                  className="h-24 border-2 border-dashed border-stone-200 dark:border-stone-700 rounded-lg flex items-center justify-center text-sm text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
                >
                  Run a health check to track progress
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-stone-500 dark:text-stone-400">
              <div className="flex items-center space-x-2">
                <Droplets className="w-4 h-4 text-bonsai-moss flex-shrink-0" />
                <span className="truncate">
                  {tree.lastWatered ? new Date(tree.lastWatered).toLocaleDateString() : 'Not set'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-bonsai-moss flex-shrink-0" />
                <span className="truncate">
                  {new Date(tree.dateAcquired).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <div className="px-4 sm:px-5 pb-3 sm:pb-4 flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(tree.id);
            }}
            className="flex items-center space-x-2 text-bonsai-green hover:text-bonsai-moss transition-colors p-1"
          >
            <Edit2 className="w-4 h-4" />
            <span className="text-sm">Edit</span>
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-stone-800 rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-700">
              <h2 className="text-lg font-semibold text-bonsai-bark dark:text-white">Health Check</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-stone-600 dark:text-stone-400">
                Take a clear photo of your bonsai tree to analyze its health.
              </p>
              <ImageUpload 
                onImageCapture={handleImageCapture}
                onError={(error) => console.error('Upload error:', error)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Health History Modal */}
      {showHealthModal && (
        <HealthHistoryModal
          tree={tree}
          healthRecords={healthRecords}
          onClose={() => setShowHealthModal(false)}
          onAnalyze={handleHealthCheck}
        />
      )}
    </>
  );
}