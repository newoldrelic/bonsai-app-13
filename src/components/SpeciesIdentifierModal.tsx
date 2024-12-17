import React, { useState } from 'react';
import { X, Loader2, Search } from 'lucide-react';
import { ImageUpload } from './ImageUpload';

interface SpeciesIdentifierModalProps {
  onClose: () => void;
  onSpeciesIdentified: (species: string) => void;
  existingImage?: string;
}

export function SpeciesIdentifierModal({ onClose, onSpeciesIdentified, existingImage }: SpeciesIdentifierModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(existingImage || null);

  const handleImageCapture = (dataUrl: string) => {
    setError(null);
    setPreviewImage(dataUrl);
  };

  const handleImageError = (error: string) => {
    setError(error);
    setPreviewImage(null);
  };

  const handleAnalyze = async () => {
    if (!previewImage) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/.netlify/functions/identify-species', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: previewImage
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to identify species');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      onSpeciesIdentified(data.species);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to identify species');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white dark:bg-stone-800 rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-700">
          <h3 className="text-lg font-semibold text-bonsai-bark dark:text-white">
            Identify Bonsai Species
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <p className="text-sm text-stone-600 dark:text-stone-300">
            {existingImage 
              ? "Using your uploaded photo to identify the species"
              : "Take a photo or upload an image of your bonsai tree to identify its species"}
          </p>

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
                {!existingImage && (
                  <button
                    onClick={() => setPreviewImage(null)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
              
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full bg-bonsai-green text-white px-4 py-2 rounded-lg hover:bg-bonsai-moss transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Analyze Bonsai</span>
              </button>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center space-x-2 text-bonsai-green">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Identifying species...</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}