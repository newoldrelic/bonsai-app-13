import React from 'react';
import { BackButton } from './BackButton';
import { useBonsaiStore } from '../store/bonsaiStore';
import { format } from 'date-fns';
import { Droplets, Leaf, FlowerIcon, TreeDeciduous } from 'lucide-react';

export function MaintenanceView() {
  const { trees } = useBonsaiStore();

  const getMaintenanceIcon = (type: string) => {
    switch (type) {
      case 'watering':
        return <Droplets className="w-5 h-5 text-blue-500" />;
      case 'pruning':
        return <Leaf className="w-5 h-5 text-green-500" />;
      case 'fertilizing':
        return <FlowerIcon className="w-5 h-5 text-yellow-500" />;
      default:
        return <TreeDeciduous className="w-5 h-5 text-bonsai-green" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <BackButton />
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Maintenance Schedule</h2>

      <div className="space-y-6">
        {trees.map(tree => (
          <div key={tree.id} className="card p-4">
            <h3 className="text-lg font-semibold text-bonsai-bark">{tree.name}</h3>
            <p className="text-sm text-gray-600">{tree.species}</p>

            <div className="space-y-4">
              {tree.maintenanceLogs.map(log => (
                <div key={log.id} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                  {getMaintenanceIcon(log.type)}
                  <div>
                    <p className="font-medium capitalize">{log.type}</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(log.date), 'PPP')}
                    </p>
                    {log.notes && (
                      <p className="text-sm text-gray-700 mt-1">{log.notes}</p>
                    )}
                  </div>
                </div>
              ))}

              {tree.maintenanceLogs.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No maintenance logs yet
                </p>
              )}
            </div>
          </div>
        ))}

        {trees.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No trees in your collection yet</p>
          </div>
        )}
      </div>
    </div>
  );
}