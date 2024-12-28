import React, { useState, useEffect } from 'react';
import { Calendar, Droplets, TreeDeciduous, Edit2, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useSubscriptionStore } from '../store/subscriptionStore';
import type { BonsaiTree } from '../types';
import { BonsaiHealthChart } from './BonsaiHealthChart';
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
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealthRecords = async () => {
      try {
        const q = query(
          collection(db, 'healthRecords'),
          where('treeId', '==', tree.id),
          orderBy('date', 'desc')
        );
        const snapshot = await getDocs(q);
        const records = snapshot.docs.map(doc => ({
          date: doc.data().date,
          leafCondition: doc.data().leafCondition,
          diseaseAndPests: doc.data().diseaseAndPests,
          overallVigor: doc.data().overallVigor
        }));
        setHealthRecords(records);
      } catch (error) {
        console.error('Error fetching health records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthRecords();
  }, [tree.id]);

  const handleHealthCheck = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSubscribed) {
      navigate('/pricing');
      return;
    }
    navigate('/health-analytics', { 
      state: { 
        treeId: tree.id,
        treeName: tree.name,
        treeImage: tree.images[0] 
      } 
    });
  };

  const handleHealthHistoryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowHealthModal(true);
  };

  return (
    <>
      <div 
        className="card overflow-hidden hover:scale-[1.02] transition-transform"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div 
          onClick={() => onClick(tree.id)}
          className="cursor-pointer"
        >
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
            
            {/* Health Check Button - Show on hover only if no records */}
            {healthRecords.length === 0 && (
              <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-200 ${
                isHovering ? 'opacity-100' : 'opacity-0'
              }`}>
                <button
                  onClick={handleHealthCheck}
                  className="bg-bonsai-green text-white px-4 py-2 rounded-lg hover:bg-bonsai-moss transition-colors flex items-center space-x-2"
                >
                  <Activity className="w-4 h-4" />
                  <span>Run Health Check</span>
                </button>
              </div>
            )}
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

            {/* Health Sparkline Section */}
            <div 
              className="mb-4 cursor-pointer" 
              onClick={(e) => handleHealthHistoryClick(e)}
            >
              {loading ? (
                <div className="h-12 bg-stone-100 dark:bg-stone-800 rounded animate-pulse" />
              ) : healthRecords.length > 0 ? (
                <div className="hover:bg-stone-50 dark:hover:bg-stone-800/50 rounded p-2 -m-2 transition-colors">
                  <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">
                    Health History
                  </p>
                  <BonsaiHealthChart data={healthRecords} />
                </div>
              ) : (
                <div 
                  onClick={handleHealthCheck}
                  className="h-12 border-2 border-dashed border-stone-200 dark:border-stone-700 rounded flex items-center justify-center text-sm text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
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