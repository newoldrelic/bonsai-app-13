import React, { useState } from 'react';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { ImageUpload } from './ImageUpload';

interface HealthAnalyzerProps {
  onAnalyze: (image: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  currentStep: number;
  steps: string[];
}

export function HealthAnalyzer({ onAnalyze, loading, error, currentStep, steps }: HealthAnalyzerProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageCapture = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error('Error reading file:', err);
    }
  };

  const handleAnalyze = () => {
    if (previewImage) {
      onAnalyze(previewImage);
    }
  };

  return (
    <div className="space-y-4">
      {!previewImage ? (
        <ImageUpload onImageCapture={handleImageCapture} />
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
            disabled={loading}
            className="w-full bg-bonsai-green text-white px-4 py-2 rounded-lg hover:bg-bonsai-moss transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <Search className="w-5 h-5" />
            <span>Analyze Health</span>
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center space-y-3 p-4 bg-bonsai-green/5 rounded-lg">
          <div className="flex items-center space-x-3 text-bonsai-green">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-medium">{steps[currentStep]}</span>
          </div>
          <div className="w-full bg-stone-200 dark:bg-stone-700 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-bonsai-green transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            This may take a few moments
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-start space-x-3 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800 dark:text-red-400">
              Health Analysis Failed
            </p>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              {error}
            </p>
            <button
              onClick={() => setPreviewImage(null)}
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