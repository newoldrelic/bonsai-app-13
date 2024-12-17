import type { MaintenanceType } from '../types';

interface MaintenanceSchedule {
  type: MaintenanceType;
  interval: number;
  message: string;
}

export const MAINTENANCE_SCHEDULES: Record<MaintenanceType, MaintenanceSchedule> = {
  watering: {
    type: 'watering',
    interval: 2 * 24 * 60 * 60 * 1000,
    message: 'Time to check if your bonsai needs water'
  },
  fertilizing: {
    type: 'fertilizing',
    interval: 14 * 24 * 60 * 60 * 1000,
    message: 'Your bonsai may need fertilizing'
  },
  pruning: {
    type: 'pruning',
    interval: 30 * 24 * 60 * 60 * 1000,
    message: 'Time to check if your bonsai needs pruning'
  },
  wiring: {
    type: 'wiring',
    interval: 60 * 24 * 60 * 60 * 1000,
    message: 'Check your bonsai\'s wiring'
  },
  repotting: {
    type: 'repotting',
    interval: 365 * 24 * 60 * 60 * 1000,
    message: 'Consider repotting your bonsai'
  },
  other: {
    type: 'other',
    interval: 7 * 24 * 60 * 60 * 1000,
    message: 'Time for bonsai maintenance check'
  }
};