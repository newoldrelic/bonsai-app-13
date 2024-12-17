import { Calendar, Droplets, TreeDeciduous, Edit2 } from 'lucide-react';
import React from 'react';
import type { BonsaiTree } from '../types';

interface BonsaiCardProps {
  tree: BonsaiTree;
  onClick: (id: string) => void;
  onEdit: (id: string) => void;
}

export function BonsaiCard({ tree, onClick, onEdit }: BonsaiCardProps) {
  return (
    <div className="card overflow-hidden hover:scale-[1.02] transition-transform">
      <div 
        onClick={() => onClick(tree.id)}
        className="cursor-pointer"
      >
        {/* Image Section */}
        <div className="relative h-40 sm:h-48 overflow-hidden">
          {tree.images[0] ? (
            <img 
              src={tree.images[0]} 
              alt={tree.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
              <TreeDeciduous className="w-12 h-12 sm:w-16 sm:h-16 text-bonsai-green opacity-50" />
            </div>
          )}
          <div className="absolute top-3 right-3 bg-bonsai-terra text-white text-xs px-2 py-1 rounded-full">
            {tree.style}
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-4 sm:p-5">
          <div className="mb-3">
            <h3 className="font-display text-lg font-semibold text-bonsai-bark dark:text-white truncate">
              {tree.name}
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 truncate">
              {tree.species}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-stone-500 dark:text-stone-400">
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-bonsai-moss flex-shrink-0" />
              <span className="truncate">
                {tree.lastWatered ? new Date(tree.lastWatered).toLocaleDateString() : 'Not set'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-bonsai-moss flex-shrink-0" />
              <span className="truncate">
                {new Date(tree.dateAcquired).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Button */}
      <div className="px-4 sm:px-5 pb-3 sm:pb-4 flex justify-end">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(tree.id);
          }}
          className="flex items-center space-x-2 text-bonsai-green hover:text-bonsai-moss transition-colors p-1"
        >
          <Edit2 className="w-4 h-4" />
          <span className="text-sm">Edit</span>
        </button>
      </div>
    </div>
  );
}