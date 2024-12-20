// Handles the rendering of individual form steps
// TreeFormSteps.tsx
import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import type { BonsaiStyle } from '../types';
import { ImageUpload } from './ImageUpload';
import { StyleSelector } from './StyleSelector';
import { MaintenanceSection } from './MaintenanceSection';
import { SpeciesIdentifierLink } from './SpeciesIdentifierLink';

interface FormData {
  name: string;
  species: string;
  style: BonsaiStyle;
  dateAcquired: string;
  images: string[];
  notes: string;
  notifications: {
    watering: boolean;
    fertilizing: boolean;
    pruning: boolean;
    wiring: boolean;
    repotting: boolean;
  };
  notificationSettings: {
    hours: number;
    minutes: number;
  };
}

interface TreeFormStepsProps {
  formData: FormData;
  onFormDataChange: (updates: Partial<FormData>) => void;
  onShowSpeciesIdentifier: () => void;
  imageError: string | null;
  onImageError: (error: string | null) => void;
  addToCalendar: boolean;
  onAddToCalendarChange: (value: boolean) => void;
}

export function TreeFormSteps({
  formData,
  onFormDataChange,
  onShowSpeciesIdentifier,
  imageError,
  onImageError,
  addToCalendar,
  onAddToCalendarChange
}: TreeFormStepsProps) {

  const handleImageCapture = (dataUrl: string) => {
    onImageError(null);
    onFormDataChange({
      images: [...formData.images, dataUrl]
    });
  };

  const handleNotificationChange = (type: keyof typeof formData.notifications, enabled: boolean) => {
    onFormDataChange({
      notifications: {
        ...formData.notifications,
        [type]: enabled
      }
    });
  };

  const handleNotificationTimeChange = (hours: number, minutes: number) => {
    onFormDataChange({
      notificationSettings: { hours, minutes }
    });
  };

  const renderNameStep = () => (
    <div className="form-group text-center">
      <label htmlFor="name" className="form-label text-xl mb-4">Name your Bonsai tree...</label>
      <input
        type="text"
        id="name"
        required
        value={formData.name}
        onChange={(e) => onFormDataChange({ name: e.target.value })}
        className="form-input text-center text-xl max-w-md"
        placeholder="Enter tree name"
        autoFocus
      />
    </div>
  );

  const renderPhotoStep = () => (
    <div className="form-group text-center">
      <label className="form-label text-xl mb-4">Add a photo of your tree</label>
      <div className="w-full">
        <ImageUpload 
          onImageCapture={handleImageCapture}
          onError={onImageError}
        />
        
        {imageError && (
          <div className="mt-2 flex items-start space-x-2 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{imageError}</span>
          </div>
        )}
        
        {formData.images.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {formData.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Tree photo ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => onFormDataChange({
                    images: formData.images.filter((_, i) => i !== index)
                  })}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderSpeciesStep = () => (
    <div className="form-group text-center">
      <label htmlFor="species" className="form-label text-xl mb-4">What species is your tree?</label>
      <input
        type="text"
        id="species"
        required
        value={formData.species}
        onChange={(e) => onFormDataChange({ species: e.target.value })}
        className="form-input text-center text-xl"
        placeholder="e.g., Japanese Maple"
      />
      <div className="mt-4 flex justify-center">
        <SpeciesIdentifierLink
          hasUploadedImage={formData.images.length > 0}
          onClick={onShowSpeciesIdentifier}
        />
      </div>
    </div>
  );

  const renderStyleStep = () => (
    <div className="form-group text-center">
      <label className="form-label text-xl mb-2">Select your tree's style</label>
      <div className="w-full scale-75 md:scale-100">
        <StyleSelector
          value={formData.style}
          onChange={(style) => onFormDataChange({ style })}
        />
      </div>
    </div>
  );

  const renderDateStep = () => (
    <div className="form-group text-center">
      <label htmlFor="dateAcquired" className="form-label text-xl mb-4">When did you get your tree?</label>
      <input
        type="date"
        id="dateAcquired"
        required
        value={formData.dateAcquired}
        onChange={(e) => onFormDataChange({ dateAcquired: e.target.value })}
        className="form-input text-center text-xl"
      />
    </div>
  );

  const renderNotesStep = () => (
    <div className="form-group text-center">
      <label htmlFor="notes" className="form-label text-xl mb-4">Any additional notes?</label>
      <textarea
        id="notes"
        rows={4}
        value={formData.notes}
        onChange={(e) => onFormDataChange({ notes: e.target.value })}
        className="form-input text-center"
        placeholder="Add any notes about your bonsai..."
      />
    </div>
  );

  const renderMaintenanceStep = () => (
    <div className="form-group">
      <MaintenanceSection
        notifications={formData.notifications}
        notificationTime={formData.notificationSettings}
        onNotificationChange={handleNotificationChange}
        onNotificationTimeChange={handleNotificationTimeChange}
        addToCalendar={addToCalendar}
        onAddToCalendarChange={onAddToCalendarChange}
      />
    </div>
  );

  return {
    renderNameStep,
    renderPhotoStep,
    renderSpeciesStep,
    renderStyleStep,
    renderDateStep,
    renderNotesStep,
    renderMaintenanceStep
  };
}