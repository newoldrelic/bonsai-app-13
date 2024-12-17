import React from 'react';
import { Droplets, Leaf, FlowerIcon, TreeDeciduous, Wrench, Scissors } from 'lucide-react';
import type { MaintenanceType } from '../types';

interface MaintenanceTypeIconProps {
  type: MaintenanceType;
  className?: string;
}

export function MaintenanceTypeIcon({ type, className = "w-5 h-5" }: MaintenanceTypeIconProps) {
  switch (type) {
    case 'watering':
      return <Droplets className={`${className} text-blue-500`} />;
    case 'pruning':
      return <Scissors className={`${className} text-green-500`} />;
    case 'fertilizing':
      return <FlowerIcon className={`${className} text-yellow-500`} />;
    case 'wiring':
      return <Wrench className={`${className} text-orange-500`} />;
    case 'repotting':
      return <TreeDeciduous className={`${className} text-bonsai-green`} />;
    default:
      return <Leaf className={`${className} text-bonsai-green`} />;
  }
}