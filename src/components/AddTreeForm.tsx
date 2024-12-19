import React, { useState, useCallback } from 'react';
import { X, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import type { BonsaiStyle } from '../types';
import { ImageUpload } from './ImageUpload';
import { SpeciesIdentifierModal } from './SpeciesIdentifierModal';
import { SpeciesIdentifierLink } from './SpeciesIdentifierLink';
import { StyleSelector } from './StyleSelector';
import { MaintenanceSection } from './MaintenanceSection';
import { generateMaintenanceEvents, downloadCalendarFile } from '../utils/calendar';
import { requestNotificationPermission, areNotificationsEnabled } from '../utils/notifications';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { notificationService } from '../services/notificationService';
import { debug } from '../utils/debug';

interface AddTreeFormProps {
  onClose: () => void;
  onSubmit: (data: any, isSubscribed: boolean) => Promise<any>;
}

const FORM_STEPS = [
  { id: 'name', label: 'Name Your Tree' },
  { id: 'photo', label: 'Add a Photo' },
  { id: 'species', label: 'Select Species' },
  { id: 'style', label: 'Choose Style' },
  { id: 'date', label: 'Date Acquired' },
  { id: 'notes', label: 'Additional Notes' },
  { id: 'maintenance', label: 'Maintenance Schedule' }
];

export function AddTreeForm({ onClose, onSubmit }: AddTreeFormProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    draggable: false,
    loop: false 
  });
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    species: '',
    style: 'Chokkan' as BonsaiStyle,
    dateAcquired: new Date().toISOString().split('T')[0],
    images: [] as string[],
    notes: '',
    notifications: {
      watering: false,
      fertilizing: false,
      pruning: false,
      wiring: false,
      repotting: false
    },
    notificationSettings: {
      hours: 9,
      minutes: 0
    }
  });

  const [addToCalendar, setAddToCalendar] = useState(false);
  const [showSpeciesIdentifier, setShowSpeciesIdentifier] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { getCurrentPlan } = useSubscriptionStore();
  const currentPlan = getCurrentPlan();
  const isSubscribed = currentPlan.id !== 'hobby';

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      setCurrentStep(prev => Math.max(0, prev - 1));
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
      setCurrentStep(prev => Math.min(FORM_STEPS.length - 1, prev + 1));
    }
  }, [emblaApi]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    
    if (submitting) return;
    
    // Only proceed if we're on the last step
    if (currentStep !== FORM_STEPS.length - 1) {
      scrollNext();
      return;
    }
    
    setSubmitting(true);
    
    try {
      const hasEnabledNotifications = Object.values(formData.notifications).some(value => value);
      const createdTree = await onSubmit(formData, isSubscribed);

      if (hasEnabledNotifications && areNotificationsEnabled()) {
        const enabledTypes = Object.entries(formData.notifications)
          .filter(([_, enabled]) => enabled)
          .map(([type]) => type as MaintenanceType);

        for (const type of enabledTypes) {
          try {
            await notificationService.updateMaintenanceSchedule(
              createdTree.id,
              createdTree.name,
              type,
              true,
              undefined,
              formData.notificationSettings
            );
          } catch (error) {
            console.error(`Failed to setup ${type} notification:`, error);
          }
        }
      }

      if (addToCalendar) {
        try {
          const selectedTypes = (Object.entries(formData.notifications)
            .filter(([_, enabled]) => enabled)
            .map(([type]) => type)) as MaintenanceType[];

          const calendarContent = await generateMaintenanceEvents(
            { ...createdTree, maintenanceLogs: [], userEmail: '' },
            selectedTypes
          );
          downloadCalendarFile(calendarContent, `${formData.name}-maintenance.ics`);
        } catch (error) {
          debug.error('Failed to generate calendar events:', error);
        }
      }

      onClose();
    } catch (error) {
      debug.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageCapture = (dataUrl: string) => {
    setImageError(null);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, dataUrl]
    }));
  };

  const handleImageError = (error: string) => {
    setImageError(error);
  };

  const handleSpeciesIdentified = (species: string) => {
    setFormData(prev => ({
      ...prev,
      species
    }));
  };

  const handleNotificationChange = (type: keyof typeof formData.notifications, enabled: boolean) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: enabled
      }
    }));
  };

  const handleNotificationTimeChange = (hours: number, minutes: number) => {
    setFormData(prev => ({
      ...prev,
      notificationSettings: { hours, minutes }
    }));
  };

  const renderStep = (step: string) => {
    switch (step) {
      case 'name':
        return (
          <div className="form-group h-full flex flex-col justify-center items-center">
            <label htmlFor="name" className="form-label text-xl mb-4">What's your tree's name?</label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input text-center text-xl max-w-md"
              placeholder="Enter tree name"
              autoFocus
            />
          </div>
        );

      case 'photo':
        return (
          <div className="h-full flex flex-col justify-center items-center space-y-6">
            <label className="form-label text-xl">Add a photo of your tree</label>
            <div className="w-full max-w-md">
              <ImageUpload 
                onImageCapture={handleImageCapture}
                onError={handleImageError}
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
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index)
                        }))}
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

      case 'species':
        return (
          <div className="h-full flex flex-col justify-center items-center space-y-6">
            <div className="form-group w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <label htmlFor="species" className="form-label text-xl">What species is your tree?</label>
                <SpeciesIdentifierLink
                  hasUploadedImage={formData.images.length > 0}
                  onClick={() => setShowSpeciesIdentifier(true)}
                />
              </div>
              <input
                type="text"
                id="species"
                required
                value={formData.species}
                onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                className="form-input text-center text-xl"
                placeholder="e.g., Japanese Maple"
              />
            </div>
          </div>
        );

      case 'style':
        return (
          <div className="h-full flex flex-col justify-center items-center space-y-6">
            <label className="form-label text-xl">Select your tree's style</label>
            <div className="w-full max-w-2xl">
              <StyleSelector
                value={formData.style}
                onChange={(style) => setFormData({ ...formData, style })}
              />
            </div>
          </div>
        );

      case 'date':
        return (
          <div className="h-full flex flex-col justify-center items-center space-y-6">
            <div className="form-group w-full max-w-md">
              <label htmlFor="dateAcquired" className="form-label text-xl mb-4">When did you get your tree?</label>
              <input
                type="date"
                id="dateAcquired"
                required
                value={formData.dateAcquired}
                onChange={(e) => setFormData({ ...formData, dateAcquired: e.target.value })}
                className="form-input text-center text-xl"
              />
            </div>
          </div>
        );

      case 'notes':
        return (
          <div className="h-full flex flex-col justify-center items-center space-y-6">
            <div className="form-group w-full max-w-md">
              <label htmlFor="notes" className="form-label text-xl mb-4">Any additional notes?</label>
              <textarea
                id="notes"
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="form-input text-center"
                placeholder="Add any notes about your bonsai..."
              />
            </div>
          </div>
        );

      case 'maintenance':
        return (
          <div className="h-full flex flex-col justify-center items-center overflow-y-auto">
            <div className="w-full max-w-2xl">
              <MaintenanceSection
                notifications={formData.notifications}
                notificationTime={formData.notificationSettings}
                onNotificationChange={handleNotificationChange}
                onNotificationTimeChange={handleNotificationTimeChange}
                addToCalendar={addToCalendar}
                onAddToCalendarChange={setAddToCalendar}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 pb-24 z-50">
      <div className="bg-white dark:bg-stone-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[calc(100vh-130px)] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex flex-col items-center gap-3 p-3 border-b border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 rounded-t-xl">
          <div className="w-full flex items-center justify-between">
            <h2 className="text-lg font-semibold text-bonsai-bark dark:text-white">Add New Bonsai</h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-stone-500 dark:text-stone-400" />
            </button>
          </div>
          
          {/* Step indicators */}
          <div className="flex items-center gap-2">
            {FORM_STEPS.map((step, index) => (
              <div 
                key={step.id}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep 
                    ? 'bg-bonsai-green' 
                    : 'bg-stone-200 dark:bg-stone-700'
                }`}
                title={step.label}
              />
            ))}
          </div>
        </div>
   
        <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
          {/* Carousel area */}
          <div className="flex-1 min-h-0 overflow-auto">
            <div className="h-full" ref={emblaRef}>
              <div className="flex h-full">
                {FORM_STEPS.map((step) => (
                  <div key={step.id} className="flex-[0_0_100%] min-w-0 p-3">
                    {renderStep(step.id)}
                  </div>
                ))}
              </div>
            </div>
          </div>
   
          {/* Navigation */}
          <div className="flex-shrink-0 p-3 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between mt-auto">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-3 py-1.5 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>
   
            {currentStep === FORM_STEPS.length - 1 ? (
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center space-x-2 px-4 py-1.5 bg-bonsai-green text-white rounded-lg hover:bg-bonsai-moss transition-colors disabled:opacity-50"
              >
                <span>{submitting ? 'Adding Tree...' : 'Add Tree'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={scrollNext}
                className="flex items-center space-x-2 px-3 py-1.5 text-bonsai-green hover:bg-bonsai-green/10 rounded-lg transition-colors"
              >
                <span>Next</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>
      </div>
   
      {showSpeciesIdentifier && (
        <SpeciesIdentifierModal
          onClose={() => setShowSpeciesIdentifier(false)}
          onSpeciesIdentified={handleSpeciesIdentified}
          existingImage={formData.images[0]}
        />
      )}
    </div>
   );
}