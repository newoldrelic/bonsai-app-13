import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BackButton } from './BackButton';
import { Calendar, Plus, TreeDeciduous } from 'lucide-react';
import { useBonsaiStore } from '../store/bonsaiStore';
import { format } from 'date-fns';
import { MaintenanceLogForm } from './MaintenanceLogForm';
import { MaintenanceTypeIcon } from './MaintenanceTypeIcon';

export function TreeDetails() {
  const { id } = useParams();
  const [showLogForm, setShowLogForm] = useState(false);
  const { trees, addMaintenanceLog } = useBonsaiStore();
  const navigate = useNavigate();
  
  const tree = trees.find(t => t.id === id);

  if (!tree) {
    return (
      <div className="container mx-auto px-4 py-6">
        <BackButton />
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Tree not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 text-bonsai-green hover:text-bonsai-moss transition-colors"
          >
            Return to Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <BackButton />
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="card overflow-hidden">
          {/* Hero Image */}
          <div className="h-48 sm:h-64 relative">
            {tree.images[0] ? (
              <img 
                src={tree.images[0]} 
                alt={tree.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                <TreeDeciduous className="w-16 h-16 text-bonsai-green opacity-50" />
              </div>
            )}
            <div className="absolute top-4 right-4 bg-bonsai-terra text-white px-3 py-1 rounded-full text-sm">
              {tree.style}
            </div>
          </div>

          {/* Tree Info */}
          <div className="p-4 sm:p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-bonsai-bark dark:text-white mb-2">{tree.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{tree.species}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Calendar className="w-5 h-5 text-bonsai-moss flex-shrink-0" />
                <span>Acquired: {format(new Date(tree.dateAcquired), 'PP')}</span>
              </div>
              {tree.lastWatered && (
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <MaintenanceTypeIcon type="watering" />
                  <span>Last Watered: {format(new Date(tree.lastWatered), 'PP')}</span>
                </div>
              )}
            </div>

            {tree.notes && (
              <div className="mb-6">
                <h3 className="font-medium text-bonsai-bark dark:text-white mb-2">Notes</h3>
                <p className="text-gray-600 dark:text-gray-400">{tree.notes}</p>
              </div>
            )}

            {/* Maintenance Logs */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-xl font-medium text-bonsai-bark dark:text-white">Maintenance History</h3>
                <button
                  onClick={() => setShowLogForm(true)}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-bonsai-green text-white rounded-lg hover:bg-bonsai-moss transition-all transform hover:scale-105 shadow-md hover:shadow-lg w-full sm:w-auto"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Add Maintenance Log</span>
                </button>
              </div>

              <div className="space-y-4">
                {tree.maintenanceLogs.map(log => (
                  <div key={log.id} className="flex items-start space-x-4 p-4 bg-stone-50 dark:bg-stone-800/50 rounded-lg">
                    <MaintenanceTypeIcon type={log.type} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium capitalize text-bonsai-bark dark:text-white">{log.type}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {format(new Date(log.date), 'PP')}
                        </span>
                      </div>
                      {log.notes && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{log.notes}</p>
                      )}
                      {log.images && log.images.length > 0 && (
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {log.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Maintenance photo ${index + 1}`}
                              className="rounded-lg w-full h-24 sm:h-32 object-cover"
                              loading="lazy"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {tree.maintenanceLogs.length === 0 && (
                  <div className="text-center py-8 bg-stone-50 dark:bg-stone-800/50 rounded-lg">
                    <TreeDeciduous className="w-12 h-12 text-bonsai-green/30 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">No maintenance logs yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showLogForm && (
        <MaintenanceLogForm
          onClose={() => setShowLogForm(false)}
          onSubmit={(formData) => {
            addMaintenanceLog(tree.id, formData);
            setShowLogForm(false);
          }}
        />
      )}
    </div>
  );
}