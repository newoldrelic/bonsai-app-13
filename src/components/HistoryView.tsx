import React from 'react';
import { BackButton } from './BackButton';
import { useBonsaiStore } from '../store/bonsaiStore';
import { format } from 'date-fns';
import { TreeDeciduous } from 'lucide-react';

export function HistoryView() {
  const { trees } = useBonsaiStore();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <BackButton />
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Care History</h2>

      <div className="space-y-6">
        {trees.map(tree => (
          <div key={tree.id} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-bonsai-bark">{tree.name}</h3>
                <p className="text-sm text-gray-600">{tree.species}</p>
              </div>
              <span className="px-3 py-1 bg-bonsai-green/10 text-bonsai-green rounded-full text-sm">
                {tree.style}
              </span>
            </div>

            <div className="space-y-6">
              <div className="relative pl-8 space-y-8 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-bonsai-green/20">
                {tree.maintenanceLogs.length > 0 ? (
                  tree.maintenanceLogs.map(log => (
                    <div key={log.id} className="relative">
                      <div className="absolute -left-8 w-4 h-4 rounded-full bg-bonsai-green"></div>
                      
                      <div className="card p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium capitalize text-bonsai-bark">
                            {log.type}
                          </h4>
                          <time className="text-sm text-gray-500">
                            {format(new Date(log.date), 'PPP')}
                          </time>
                        </div>
                        
                        {log.notes && (
                          <p className="text-gray-600 text-sm">{log.notes}</p>
                        )}

                        {log.images && log.images.length > 0 && (
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            {log.images.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`Maintenance photo ${index + 1}`}
                                className="rounded-lg w-full h-32 object-cover"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <TreeDeciduous className="w-12 h-12 text-bonsai-green/30 mx-auto mb-2" />
                    <p className="text-gray-500">No maintenance history yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {trees.length === 0 && (
          <div className="text-center py-12">
            <TreeDeciduous className="w-16 h-16 text-bonsai-green/30 mx-auto mb-3" />
            <p className="text-gray-500">No trees in your collection yet</p>
          </div>
        )}
      </div>
    </div>
  );
}