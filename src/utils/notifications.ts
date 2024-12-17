import { format, addDays, setHours, setMinutes } from 'date-fns';
import type { MaintenanceType } from '../types';
import { debug } from './debug';

interface NotificationSchedule {
  type: MaintenanceType;
  interval: number; // in milliseconds
  message: string;
}

export const MAINTENANCE_SCHEDULES: Record<MaintenanceType, NotificationSchedule> = {
  watering: {
    type: 'watering',
    interval: 2 * 24 * 60 * 60 * 1000, // 2 days
    message: 'Time to check if your bonsai needs water'
  },
  fertilizing: {
    type: 'fertilizing',
    interval: 14 * 24 * 60 * 60 * 1000, // 14 days
    message: 'Your bonsai may need fertilizing'
  },
  pruning: {
    type: 'pruning',
    interval: 30 * 24 * 60 * 60 * 1000, // 30 days
    message: 'Time to check if your bonsai needs pruning'
  },
  wiring: {
    type: 'wiring',
    interval: 60 * 24 * 60 * 60 * 1000, // 60 days
    message: 'Check your bonsai\'s wiring'
  },
  repotting: {
    type: 'repotting',
    interval: 365 * 24 * 60 * 60 * 1000, // 365 days
    message: 'Consider repotting your bonsai'
  },
  other: {
    type: 'other',
    interval: 7 * 24 * 60 * 60 * 1000, // 7 days
    message: 'Time for bonsai maintenance check'
  }
};

// Store notification timers
const notificationTimers: Record<string, NodeJS.Timeout> = {};

// Store notification time preference in localStorage
const NOTIFICATION_TIME_KEY = 'bonsai-notification-time';

export const setNotificationTime = (hours: number, minutes: number) => {
  localStorage.setItem(NOTIFICATION_TIME_KEY, JSON.stringify({ hours, minutes }));
  debug.info('Notification time set to:', { hours, minutes });
};

export const getNotificationTime = () => {
  try {
    const stored = localStorage.getItem(NOTIFICATION_TIME_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    debug.error('Error reading notification time:', error);
  }
  return { hours: 9, minutes: 0 }; // Default to 9:00 AM
};

// Function to check if notifications are already enabled
export const areNotificationsEnabled = () => {
  return 'Notification' in window && Notification.permission === 'granted';
};

// Register service worker
export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service workers are not supported');
  }

  try {
    // Only register the service worker, don't request permissions
    const registration = await navigator.serviceWorker.register('/notification-worker.js');
    debug.info('Service Worker registered:', registration);
    return registration;
  } catch (error) {
    debug.error('Service Worker registration failed:', error);
    throw error;
  }
}

// Function to request notification permissions
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    debug.warn('This browser does not support notifications');
    return false;
  }

  try {
    // Check current permission status
    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    // Request permission
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // Send a single welcome notification
      new Notification('Bonsai Care Notifications Enabled', {
        body: 'You will now receive maintenance reminders for your bonsai trees.',
        icon: '/bonsai-icon.png'
      });
      return true;
    }
    
    return false;
  } catch (error) {
    debug.error('Error requesting notification permission:', error);
    return false;
  }
};

// Clear existing notification timer
function clearExistingNotification(treeId: string, type: MaintenanceType) {
  const key = `${treeId}-${type}`;
  if (notificationTimers[key]) {
    clearTimeout(notificationTimers[key]);
    delete notificationTimers[key];
  }
}

// Schedule notification
export async function scheduleNotification(
  treeId: string,
  treeName: string,
  type: MaintenanceType,
  lastPerformed?: string
) {
  // Only proceed if notifications are enabled
  if (!areNotificationsEnabled()) {
    debug.warn('Notifications are not enabled');
    return;
  }

  const schedule = MAINTENANCE_SCHEDULES[type];
  
  // Calculate base date
  let baseDate;
  if (lastPerformed) {
    baseDate = new Date(lastPerformed);
  } else {
    // If never performed, start schedule from now but don't notify immediately
    baseDate = new Date();
    // Move the base date back by the interval to prevent immediate notification
    baseDate.setTime(baseDate.getTime() - schedule.interval);
  }
  
  const { hours, minutes } = getNotificationTime();
  
  // Calculate next notification time
  let nextDate = addDays(baseDate, schedule.interval / (24 * 60 * 60 * 1000));
  nextDate = setHours(nextDate, hours);
  nextDate = setMinutes(nextDate, minutes);

  // If the calculated time is in the past, add intervals until we reach a future time
  while (nextDate < new Date()) {
    nextDate = addDays(nextDate, schedule.interval / (24 * 60 * 60 * 1000));
  }

  const timeUntilNotification = nextDate.getTime() - Date.now();
  const key = `${treeId}-${type}`;

  // Clear any existing notification
  clearExistingNotification(treeId, type);

  debug.info(`Scheduling ${type} notification for ${treeName}:`, {
    baseDate: baseDate.toISOString(),
    nextDate: nextDate.toISOString(),
    timeUntil: timeUntilNotification / (1000 * 60 * 60) + ' hours'
  });

  // Schedule the notification
  notificationTimers[key] = setTimeout(() => {
    if (areNotificationsEnabled()) {
      try {
        const notification = new Notification(`Bonsai Maintenance: ${treeName}`, {
          body: `${schedule.message} (Last done: ${lastPerformed ? format(baseDate, 'PP') : 'Never'})`,
          icon: '/bonsai-icon.png',
          tag: key,
          requireInteraction: true
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        // Schedule next notification
        scheduleNotification(treeId, treeName, type, nextDate.toISOString());
      } catch (error) {
        debug.error('Failed to show notification:', error);
      }
    }
  }, Math.max(0, timeUntilNotification));

  debug.info(`Scheduled ${type} notification for ${treeName} at ${format(nextDate, 'PPpp')}`);
}