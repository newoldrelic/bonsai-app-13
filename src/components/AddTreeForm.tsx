// AddTreeForm.tsx
import React, { useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { BonsaiStyle } from '../types';
import { TreeFormSteps } from './TreeFormSteps';
import { TreeFormHeader } from './TreeFormHeader';
import { TreeFormNavigation } from './TreeFormNavigation';
import { SpeciesIdentifierModal } from './SpeciesIdentifierModal';
import { generateMaintenanceEvents, downloadCalendarFile } from '../utils/calendar';
import { areNotificationsEnabled } from '../utils/notifications';
import { notificationService } from '../services/notificationService';
import { debug } from '../utils/debug';

interface AddTreeFormProps {
  onClose: () => void;
  onSubmit: (data: any, isSubscribed: boolean) => Promise<any>;
  isSubscribed: boolean;
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

export function AddTreeForm({ onClose, onSubmit, isSubscribed }: AddTreeFormProps) {
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

  const handleFormEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If not on the last step, just move to next step
    if (currentStep < FORM_STEPS.length - 1) {
      scrollNext();
      return;
    }

    // Only proceed with submission if we're on the last step
    if (currentStep === FORM_STEPS.length - 1 && !submitting) {
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
    }
  };

  const handleFormDataChange = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSpeciesIdentified = (species: string) => {
    handleFormDataChange({ species });
    setShowSpeciesIdentifier(false);
  };

  const steps = new TreeFormSteps({
    formData,
    onFormDataChange: handleFormDataChange,
    onShowSpeciesIdentifier: () => setShowSpeciesIdentifier(true),
    imageError,
    onImageError: setImageError,
    addToCalendar,
    onAddToCalendarChange: setAddToCalendar
  });

  const currentStepContent = () => {
    switch (FORM_STEPS[currentStep].id) {
      case 'name': return steps.renderNameStep();
      case 'photo': return steps.renderPhotoStep();
      case 'species': return steps.renderSpeciesStep();
      case 'style': return steps.renderStyleStep();
      case 'date': return steps.renderDateStep();
      case 'notes': return steps.renderNotesStep();
      case 'maintenance': return steps.renderMaintenanceStep();
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 pb-24 z-50">
      <div className="bg-white dark:bg-stone-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[calc(100vh-200px)] flex flex-col">
        <TreeFormHeader
          currentStep={currentStep}
          steps={FORM_STEPS}
          onClose={onClose}
        />
        
        <form onSubmit={handleFormEvent} className="flex flex-col min-h-0 flex-1">
          <div className="h-[60vh] md:h-[500px] overflow-hidden"> {/* Responsive height */}
            <div ref={emblaRef} className="h-full">
              <div className="flex h-full">
                <div className="flex-[0_0_100%] min-w-0 p-3 flex justify-center">
                  <div className="w-full max-w-md overflow-y-auto">
                    {currentStepContent()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <TreeFormNavigation
            currentStep={currentStep}
            totalSteps={FORM_STEPS.length}
            onPrevious={scrollPrev}
            onNext={scrollNext}
            submitting={submitting}
          />
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