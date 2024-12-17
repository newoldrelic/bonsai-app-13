import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, Loader2 } from 'lucide-react';
import { processImage, validateImageFile } from '../utils/imageProcessing';
import { debug } from '../utils/debug';

interface ImageUploadProps {
  onImageCapture: (dataUrl: string) => void;
  onError?: (error: string) => void;
}

export function ImageUpload({ onImageCapture, onError }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setProcessing(true);
      
      // Validate file before processing
      validateImageFile(file);

      // Process the image
      const { dataUrl } = await processImage(file);
      onImageCapture(dataUrl);
      
      // Clear the input value to allow selecting the same file again
      if (event.target) {
        event.target.value = '';
      }
    } catch (error) {
      debug.error('Image processing error:', error);
      onError?.(error instanceof Error ? error.message : 'Failed to process image');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className={`flex ${isMobile ? 'gap-4' : 'justify-center'}`}>
        {isMobile && (
          <button
            type="button"
            disabled={processing}
            onClick={() => cameraInputRef.current?.click()}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-bonsai-green text-white rounded-lg hover:bg-bonsai-moss transition-colors disabled:opacity-50"
          >
            {processing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                <span>Take Photo</span>
              </>
            )}
          </button>
        )}
        
        <button
          type="button"
          disabled={processing}
          onClick={() => fileInputRef.current?.click()}
          className={`${isMobile ? 'flex-1' : 'w-48'} flex items-center justify-center space-x-2 px-4 py-2 border-2 border-bonsai-green text-bonsai-green rounded-lg hover:bg-bonsai-green hover:text-white transition-colors disabled:opacity-50`}
        >
          {processing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Upload Photo</span>
            </>
          )}
        </button>
      </div>

      {/* Regular file upload input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Camera input - only for mobile */}
      {isMobile && (
        <input
          type="file"
          ref={cameraInputRef}
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      )}
    </div>
  );
}