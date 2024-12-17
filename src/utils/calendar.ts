import { createEvents } from 'ics';
import { addDays, addMonths, addYears } from 'date-fns';
import type { BonsaiTree, MaintenanceType } from '../types';
import { MAINTENANCE_SCHEDULES } from './notifications';

interface CalendarEvent {
  title: string;
  description: string;
  start: number[];
  duration: { hours: number };
  recurrenceRule: string;
}

export function generateMaintenanceEvents(tree: BonsaiTree, types: MaintenanceType[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const events: CalendarEvent[] = types.map(type => {
      const schedule = MAINTENANCE_SCHEDULES[type];
      const startDate = new Date();
      const dateArray = [
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        startDate.getDate(),
        startDate.getHours(),
        startDate.getMinutes()
      ];

      // Calculate recurrence based on interval
      let recurrenceRule = 'FREQ=';
      const intervalDays = schedule.interval / (24 * 60 * 60 * 1000);
      
      if (intervalDays <= 7) {
        recurrenceRule += 'DAILY;INTERVAL=' + intervalDays;
      } else if (intervalDays <= 31) {
        recurrenceRule += 'WEEKLY;INTERVAL=' + Math.floor(intervalDays / 7);
      } else if (intervalDays <= 365) {
        recurrenceRule += 'MONTHLY;INTERVAL=' + Math.floor(intervalDays / 30);
      } else {
        recurrenceRule += 'YEARLY';
      }

      return {
        title: `${tree.name} - ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        description: `${schedule.message} for your ${tree.species} bonsai`,
        start: dateArray,
        duration: { hours: 1 },
        recurrenceRule
      };
    });

    createEvents(events, (error, value) => {
      if (error) {
        reject(error);
      }
      resolve(value);
    });
  });
}

export function downloadCalendarFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}