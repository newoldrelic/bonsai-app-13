import React, { useState, useRef, useEffect } from 'react';
import { Info, X } from 'lucide-react';

export default function ExpertInfoPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-full transition-colors"
      >
        <Info className="w-5 h-5 text-stone-500 dark:text-stone-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-stone-800 rounded-lg shadow-lg p-4 z-50">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-medium text-lg text-bonsai-bark dark:text-white">
              About Your Expert
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-full"
            >
              <X className="w-4 h-4 text-stone-500 dark:text-stone-400" />
            </button>
          </div>
          
          <p className="text-sm text-stone-600 dark:text-stone-300 mb-3">
            Ken Nakamur-ai is an AI bonsai expert trained on decades of bonsai knowledge.
          </p>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <ul className="space-y-1">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-bonsai-green rounded-full"></span>
                <span>Watering</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-bonsai-green rounded-full"></span>
                <span>Pruning</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-bonsai-green rounded-full"></span>
                <span>Wiring</span>
              </li>
            </ul>
            <ul className="space-y-1">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-bonsai-green rounded-full"></span>
                <span>Seasons</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-bonsai-green rounded-full"></span>
                <span>Disease</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-bonsai-green rounded-full"></span>
                <span>Tools</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}