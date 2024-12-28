import React, { useState, useEffect } from 'react';
import { Calendar, Droplets, TreeDeciduous, Edit2, Activity, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { ImageUpload } from './ImageUpload';
import type { BonsaiTree } from '../types';

interface BonsaiCardProps {
  tree: BonsaiTree;
  onClick: (id: string) => void;
  onEdit: (id: string) => void;
}

export function BonsaiCard({ tree, onClick, onEdit }: BonsaiCardProps) {
  const navigate = useNavigate();
  const { getCurrentPlan } = useSubscriptionStore();
  const currentPlan = getCurrentPlan();
  const isSubscribed = currentPlan !== 'hobby';
  const [isHovering, setIsHovering] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleHealthCheck = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSubscribed) {
      navigate('/pricing');
      return;
    }
    setShowHealthModal(true);
  };

  const handleImageCapture = (imageData: string) => {
    setPreviewImage(imageData);
  };

  const handleAnalyzeClick = () => {
    if (previewImage) {
      navigate('/health-analytics', { 
        state: { 
          treeId: tree.id,
          treeName: tree.name,
          treeImage: previewImage
        } 
      });
      setShowHealthModal(false);
      setPreviewImage(null);
    }
  };

  const handleCloseModal = () => {
    setShowHealthModal(false);
    setPreviewImage(null);
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
            
            {/* Health Check Button - Always visible on mobile, hover on desktop */}
            <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-200 ${
              isMobile || isHovering ? 'opacity-100' : 'opacity-0'
            }`}>
              <button
                onClick={handleHealthCheck}
                className="bg-bonsai-green text-white px-4 py-2 rounded-lg hover:bg-bonsai-moss transition-colors flex items-center space-x-2"
              >
                <Activity className="w-4 h-4" />
                <span>Run Health Check</span>
              </button>
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

      {/* Health Check Modal */}
      {showHealthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-stone-800 rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-700">
              <h2 className="text-lg font-semibold text-bonsai-bark dark:text-white">Health Check</h2>
              <button
                onClick={handleCloseModal}
                className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {!previewImage ? (
                <>
                  <p className="text-stone-600 dark:text-stone-400">
                    Take a clear photo of your bonsai tree to analyze its health.
                  </p>
                  <ImageUpload 
                    onImageCapture={handleImageCapture}
                    onError={(error) => console.error('Upload error:', error)}
                  />
                </>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Tree preview"
                      className="w-full h-64 object-contain rounded-lg border border-stone-200 dark:border-stone-700"
                    />
                    <button
                      onClick={() => setPreviewImage(null)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button
                    onClick={handleAnalyzeClick}
                    className="w-full bg-bonsai-green text-white px-4 py-2 rounded-lg hover:bg-bonsai-moss transition-colors flex items-center justify-center space-x-2"
                  >
                    <Activity className="w-5 h-5" />
                    <span>Analyze Health</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}