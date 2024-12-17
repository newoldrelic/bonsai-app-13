import { debug } from './debug';

const MAX_IMAGE_DIMENSION = 800;
const JPEG_QUALITY = 0.7;
const MAX_FILE_SIZE = 900 * 1024; // 900KB target to stay safely under 1MB limit

interface ProcessedImage {
  dataUrl: string;
  size: number;
}

export function validateImageFile(file: File): void {
  // Check if it's actually a file
  if (!(file instanceof File)) {
    throw new Error('Invalid file provided');
  }

  // Check file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // Check initial file size (10MB max for upload)
  const maxUploadSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxUploadSize) {
    throw new Error('Image must be smaller than 10MB');
  }
}

export function processImage(file: File): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          
          // Calculate new dimensions while maintaining aspect ratio
          if (width > height && width > MAX_IMAGE_DIMENSION) {
            height = (height * MAX_IMAGE_DIMENSION) / width;
            width = MAX_IMAGE_DIMENSION;
          } else if (height > MAX_IMAGE_DIMENSION) {
            width = (width * MAX_IMAGE_DIMENSION) / height;
            height = MAX_IMAGE_DIMENSION;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Could not get canvas context');
          }
          
          // Draw and compress image
          ctx.drawImage(img, 0, 0, width, height);
          let quality = JPEG_QUALITY;
          let dataUrl = canvas.toDataURL('image/jpeg', quality);
          let size = new Blob([dataUrl]).size;
          
          // If still too large, gradually reduce quality
          while (size > MAX_FILE_SIZE && quality > 0.1) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL('image/jpeg', quality);
            size = new Blob([dataUrl]).size;
            debug.info(`Reducing image quality to ${quality.toFixed(1)}, size: ${(size / 1024).toFixed(2)}KB`);
          }

          if (size > MAX_FILE_SIZE) {
            throw new Error('Unable to compress image to acceptable size');
          }

          resolve({ dataUrl, size });
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}