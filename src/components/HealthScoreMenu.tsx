import React, { useState, useEffect, useRef } from 'react';
import { History, Activity } from 'lucide-react';

interface HealthScoreMenuProps {
  onViewHistory: () => void;
  onRunCheck: () => void;
  className?: string;
}

export function HealthScoreMenu({ onViewHistory, onRunCheck, className = '' }: HealthScoreMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      ref={menuRef}
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
      }}
      className={`absolute inset-0 ${className}`}
    >
      {/* Overlay that appears on click */}
      <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="flex flex-col gap-2 p-2 h-full items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewHistory();
              setIsOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-stone-800 rounded-lg transition-colors text-sm font-medium w-full max-w-[200px]"
          >
            <History className="w-4 h-4" />
            <span>View History</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRunCheck();
              setIsOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-bonsai-green/90 hover:bg-bonsai-green text-white rounded-lg transition-colors text-sm font-medium w-full max-w-[200px]"
          >
            <Activity className="w-4 h-4" />
            <span>Run Health Check</span>
          </button>
        </div>
      </div>
    </div>
  );
}