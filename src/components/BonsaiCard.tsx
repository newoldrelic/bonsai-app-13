import React, { useState, useEffect } from 'react';
import { Calendar, Droplets, Leaf, Bug, TreeDeciduous, Edit2, Activity, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { useBonsaiStore } from '../store/bonsaiStore';
import { ImageUpload } from './ImageUpload';
import { CircularHealthScore } from './CircularHealthScore';
import { HealthHistoryModal } from './HealthHistoryModal';
import { HealthScoreMenu } from './HealthScoreMenu';
import { MaintenanceLogForm } from './MaintenanceLogForm';
import { PieChart, Pie, Cell } from 'recharts';
import type { BonsaiTree } from '../types';

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

interface MetricsProps {
  leafCondition: number;
  diseaseAndPests: number;
  overallVigor: number;
}

const MiniHealthRings = ({ metrics }: { metrics: MetricsProps }) => {
  const rings = [
    { value: metrics.leafCondition, label: 'Leaf', Icon: Leaf },
    { value: metrics.diseaseAndPests, label: 'Disease', Icon: Bug },
    { value: metrics.overallVigor, label: 'Vigor', Icon: TreeDeciduous }
  ];
 
  const renderMetricRing = (data, index) => {
    const segments = Array.from({ length: 5 }).map((_, i) => ({
      value: 1,
      filled: i + 1 <= data.value
    }));
 
    const Icon = data.Icon;
 
    return (
      <div 
        key={data.label}
        className="flex flex-col items-center gap-2" 
      >
        <div className="w-12 h-12 flex items-center justify-center overflow-visible">
          <div className="relative w-10 h-10">
            <PieChart width={50} height={50} className="absolute" style={{ top: '-2px', left: '-2px' }}>
              <Pie
                data={segments}
                cx={17}
                cy={17}
                innerRadius={13}
                outerRadius={20}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
              >
                {segments.map((entry, i) => {
                  let fillColor = '#E5E7EB';
                  if (entry.filled) {
                    if (data.value >= 4) fillColor = '#10B981'; // emerald-500
                    else if (data.value >= 3) fillColor = '#84CC16'; // lime-500
                    else if (data.value >= 2) fillColor = '#EAB308'; // yellow-500
                    else fillColor = '#EF4444'; // red-500
                  }
                  return (
                    <Cell
                      key={`cell-${i}`}
                      fill={fillColor}
                      opacity={1}
                    />
                  );
                })}
              </Pie>
            </PieChart>
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <Icon 
                className="w-5 h-5" 
                style={{ 
                  color: data.value >= 4 ? '#10B981' : 
                         data.value >= 3 ? '#84CC16' : 
                         data.value >= 2 ? '#EAB308' : 
                         '#EF4444'
                }} 
              />
            </div>
          </div>
        </div>
        <div className="text-xs text-center">
          <div className="font-medium text-stone-700 dark:text-stone-200">{data.value.toFixed(1)}</div>
          <div className="text-stone-500 dark:text-stone-400 whitespace-nowrap">{data.label}</div>
        </div>
      </div>
    );
  };
 
  return (
    <div className="flex justify-center gap-6 mt-4 px-6 py-3 overflow-visible">
      {rings.map((ring, index) => renderMetricRing(ring, index))}
    </div>
  );
 };

export function BonsaiCard({ tree, onClick, onEdit }: BonsaiCardProps) {
  const navigate = useNavigate();
  const { getCurrentPlan } = useSubscriptionStore();
  const { addMaintenanceLog } = useBonsaiStore();
  const currentPlan = getCurrentPlan();
  const isSubscribed = currentPlan !== 'hobby';
  
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
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

  const handleHealthCheck = () => {
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

  const handleHealthHistoryClick = () => {
    setShowHealthModal(true);
  };

  const handleAddMaintenanceLog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowLogForm(true);
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
      <div className="card overflow-hidden hover:scale-[1.02] transition-transform">
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
            <div className="mb-4 relative">
              {loading ? (
                <div className="h-24 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-bonsai-green/30 border-t-bonsai-green rounded-full animate-spin" />
                </div>
              ) : healthRecords.length > 0 && latestScore ? (
                <>
                  <CircularHealthScore
                    score={latestScore.score}
                    date={latestScore.date}
                  />
                  <MiniHealthRings 
                    metrics={{
                      leafCondition: healthRecords[0].leafCondition,
                      diseaseAndPests: healthRecords[0].diseaseAndPests,
                      overallVigor: healthRecords[0].overallVigor
                    }}
                  />
                  <HealthScoreMenu 
                    onViewHistory={handleHealthHistoryClick}
                    onRunCheck={handleHealthCheck}
                  />
                </>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHealthCheck();
                  }}
                  className="w-full flex items-center justify-center space-x-2 text-bonsai-green hover:text-bonsai-moss transition-colors py-4"
                >
                  <Activity className="w-5 h-5" />
                  <span className="font-medium">Run Health Check</span>
                </button>
              )}
            </div>
            
            {/* Info Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-stone-500 dark:text-stone-400">
              <div className="flex items-center space-x-2">
                {tree.lastWatered ? (
                  <>
                    <Droplets className="w-4 h-4 text-bonsai-moss flex-shrink-0" />
                    <span className="truncate">
                      {new Date(tree.lastWatered).toLocaleDateString()}
                    </span>
                  </>
                ) : (
                  <button
                    onClick={handleAddMaintenanceLog}
                    className="text-bonsai-green hover:text-bonsai-moss transition-colors flex items-center space-x-2"
                  >
                    <Droplets className="w-4 h-4" />
                    <span>Add Watering Log</span>
                  </button>
                )}
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

      {/* Modals */}
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

      {showHealthModal && (
        <HealthHistoryModal
          tree={tree}
          healthRecords={healthRecords}
          onClose={() => setShowHealthModal(false)}
          onAnalyze={handleHealthCheck}
        />
      )}

      {showLogForm && (
        <MaintenanceLogForm
          onClose={() => setShowLogForm(false)}
          onSubmit={(formData) => {
            addMaintenanceLog(tree.id, formData);
            setShowLogForm(false);
          }}
        />
      )}
    </>
  );
}