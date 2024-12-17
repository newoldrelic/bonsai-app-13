import React, { useState } from 'react';
import { Loader2, TreeDeciduous, AlertCircle, Search, Crown } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { useSpeciesIdentifierStore, getFreeUsagesRemaining, hasRemainingUsages } from '../store/speciesIdentifierStore';
import { useNavigate } from 'react-router-dom';

interface SpeciesIdentifierProps {
  onSpeciesIdentified: (species: string) => void;
}

export function SpeciesIdentifier({ onSpeciesIdentified }: SpeciesIdentifierProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { getCurrentPlan } = useSubscriptionStore();
  const { incrementUsage } = useSpeciesIdentifierStore();
  const navigate = useNavigate();

  const currentPlan = getCurrentPlan();
  const isSubscribed = currentPlan.id !== 'hobby';
  const remainingUsages = getFreeUsagesRemaining();

  const handleImageCapture = (dataUrl: string) => {
    if (!isSubscribed && !hasRemainingUsages()) {
      navigate('/pricing');
      return;
    }

    setError(null);
    setPreviewImage(dataUrl);
  };

  const handleImageError = (error: string) => {
    setError(error);
    setPreviewImage(null);
  };

  const handleAnalyze = async () => {
    if (!previewImage) return;

    if (!isSubscribed && !hasRemainingUsages()) {
      navigate('/pricing');
      return;
    }

    setLoading(true);
    setError(null);
    setStatus('Analyzing image with AI...');

    try {
      const response = await fetch('/.netlify/functions/identify-species', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: previewImage })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      const data = await response.json();
      if (!data.species) {
        throw new Error('No species identification received');
      }

      if (!isSubscribed) {
        incrementUsage();
      }

      setStatus('Species identified successfully!');
      onSpeciesIdentified(data.species);
      setPreviewImage(null);
    } catch (err: any) {
      console.error('Species identification error:', err);
      setError(err.message || 'Failed to identify species');
    } finally {
      setLoading(false);
      if (!error) {
        setTimeout(() => setStatus(''), 2000);
      }
    }
  };

  return (
    <div className="space-y-4">
      {!isSubscribed && (
        <div className="p-4 bg-bonsai-green/10 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TreeDeciduous className="w-5 h-5 text-bonsai-green" />
            <span className="text-sm text-bonsai-bark dark:text-white">
              {remainingUsages} free identifications remaining
            </span>
          </div>
          <button
            onClick={() => navigate('/pricing')}
            className="flex items-center space-x-2 text-sm text-bonsai-terra hover:text-bonsai-clay transition-colors"
          >
            <Crown className="w-4 h-4" />
            <span>Upgrade for unlimited</span>
          </button>
        </div>
      )}

      {!previewImage ? (
        <ImageUpload 
          onImageCapture={handleImageCapture}
          onError={handleImageError}
        />
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={previewImage}
              alt="Bonsai preview"
              className="w-full h-64 object-contain rounded-lg border border-stone-200 dark:border-stone-700"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              ×
            </button>
          </div>
          
          <button
            onClick={handleAnalyze}
            disabled={loading || (!isSubscribed && !hasRemainingUsages())}
            className="w-full bg-bonsai-green text-white px-4 py-2 rounded-lg hover:bg-bonsai-moss transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <Search className="w-5 h-5" />
            <span>Analyze Bonsai</span>
          </button>
        </div>
      )}

      {(loading || status) && (
        <div className="flex flex-col items-center justify-center space-y-3 p-4 bg-bonsai-green/5 rounded-lg">
          <div className="flex items-center space-x-2 text-bonsai-green">
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            <span>{status || 'Processing...'}</span>
          </div>
          {loading && (
            <p className="text-sm text-stone-500 dark:text-stone-400">
              This may take a few moments
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-start space-x-3 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800 dark:text-red-400">
              Species Identification Failed
            </p>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              {error}
            </p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 underline"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}