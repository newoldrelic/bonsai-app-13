import { debug } from '../utils/debug';
import { MAINTENANCE_SCHEDULES } from '../config/maintenance';
import type { MaintenanceType } from '../types';
import { addDays, setHours, setMinutes } from 'date-fns';

class NotificationService {
  private notificationTimers: Record<string, NodeJS.Timeout> = {};
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
  private initialized = false;
  private initializationError: Error | null = null;

  async init(): Promise<void> {
    if (this.initialized) return;
    
    if (!('Notification' in window)) {
      this.initializationError = new Error('This browser does not support notifications');
      throw this.initializationError;
    }
  
    try {
      this.initialized = true;
      this.initializationError = null;
    } catch (error) {
      this.initializationError = error instanceof Error ? error : new Error('Unknown error');
      throw this.initializationError;
    }
  }

  async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      if (this.initializationError) {
        throw this.initializationError;
      }
      await this.init();
    }
  }

  async requestPermission(): Promise<boolean> {
    try {
      if (Notification.permission === 'granted') {
        return true;
      }
      
      if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
      
      return false;
    } catch (error) {
      debug.error('Failed to request notification permission:', error);
      return false;
    }
  }

  private async showSystemNotification(title: string, options: NotificationOptions = {}): Promise<void> {
    try {
        console.log('A. Attempting to show notification', { 
            title, 
            options,
            permissionState: Notification.permission
        });

        // Create basic notification
        const notification = new Notification(title, {
            ...options,
            icon: '/bonsai-icon.svg',
            requireInteraction: true,
            silent: false,
            tag: options.tag || 'default-tag'
        });

        // Handle notification clicks
        notification.onclick = () => {
            console.log('Notification clicked:', options.data);
            if (options.data?.type) {
                console.log(`Maintenance task ${options.data.type} clicked`);
            }
            notification.close();
        };

        console.log('B. Basic notification sent');
    } catch (error) {
        console.error('Failed to show notification:', error);
        throw error;
    }
  }

  async updateMaintenanceSchedule(
    treeId: string,
    treeName: string,
    type: MaintenanceType,
    enabled: boolean,
    lastPerformed?: string,
    notificationTime?: { hours: number; minutes: number }
  ): Promise<void> {
    try {
      console.log('1. Starting maintenance schedule update', {
        treeId,
        treeName,
        type,
        enabled,
        lastPerformed,
        notificationTime
      });

      await this.ensureInitialized();
      
      const key = `${treeId}-${type}`;
      console.log('2. After initialization', { key });

      // Clear existing timer
      if (this.notificationTimers[key]) {
        clearTimeout(this.notificationTimers[key]);
        delete this.notificationTimers[key];
        console.log('3. Cleared existing timer', { key });
      }

      if (!enabled) {
        console.log('4. Notifications not enabled, returning');
        return;
      }

      console.log('5. Checking notification permission');
      if (Notification.permission !== 'granted') {
        throw new Error('Notification permission required');
      }

      const schedule = MAINTENANCE_SCHEDULES[type];
      const now = new Date();
      console.log('6. Starting date calculations', { now, schedule });
      
      // Set up initial date calculations
      let baseDate;
      if (lastPerformed) {
        baseDate = new Date(lastPerformed);
        console.log('7a. Using last performed date as base', { baseDate });
      } else {
        baseDate = new Date();
        baseDate.setHours(notificationTime?.hours ?? 9);
        baseDate.setMinutes(notificationTime?.minutes ?? 0);
        baseDate.setSeconds(0);
        baseDate.setMilliseconds(0);
        
        // Move back one interval to ensure first notification isn't immediate
        baseDate.setTime(baseDate.getTime() - schedule.interval);
        console.log('7b. Created default base date', { baseDate });
      }

      // Calculate next notification time
      let nextDate = new Date(baseDate.getTime() + schedule.interval);
      nextDate.setHours(notificationTime?.hours ?? 9);
      nextDate.setMinutes(notificationTime?.minutes ?? 0);
      nextDate.setSeconds(0);
      nextDate.setMilliseconds(0);
      console.log('8. Initial next date calculated', { nextDate });

      // If next date is in the past, add intervals until we reach a future time
      while (nextDate <= now) {
        nextDate.setTime(nextDate.getTime() + schedule.interval);
        console.log('9. Added interval to reach future date', { nextDate });
      }

      // Calculate time until next notification
      let timeUntilNotification = nextDate.getTime() - now.getTime();
      console.log('10. Time until notification calculated', { 
        timeUntilNotification,
        hours: Math.floor(timeUntilNotification / (1000 * 60 * 60)),
        minutes: Math.floor((timeUntilNotification % (1000 * 60 * 60)) / (1000 * 60))
      });

      // If time is negative or 0, add another interval
      if (timeUntilNotification <= 0) {
        console.log('11. Time is past or now, adding another interval');
        nextDate.setTime(nextDate.getTime() + schedule.interval);
        timeUntilNotification = nextDate.getTime() - now.getTime();
        console.log('12. Updated timing after interval addition', {
          nextDate,
          timeUntilNotification
        });
      } 
      // If time is very close (within 1 minute), show notification immediately
      else if (timeUntilNotification < 60000) {
        timeUntilNotification = 1000; // Show after 1 second
        console.log('11. Time is very close, showing soon', {
          timeUntilNotification
        });
      }

      // Schedule notification
      console.log('13. Setting up notification timer');
      this.notificationTimers[key] = setTimeout(async () => {
        try {
          console.log('14. Timer fired, showing notification', {
            treeId,
            treeName,
            type,
            scheduledFor: nextDate.toISOString(),
            actualTime: new Date().toISOString()
          });

          await this.showSystemNotification(`${type} Maintenance: ${treeName}`, {
            body: schedule.message,
            tag: key,
            data: { treeId, type }
          });

          console.log('15. Notification shown, scheduling next');
          // Schedule next notification
          await this.updateMaintenanceSchedule(
            treeId, 
            treeName, 
            type, 
            true, 
            nextDate.toISOString(),
            { hours: nextDate.getHours(), minutes: nextDate.getMinutes() }
          );
        } catch (error) {
          console.error('Timer callback error:', error);
        }
      }, timeUntilNotification);

      console.log('16. Schedule complete', {
        key,
        nextDate: nextDate.toISOString(),
        timeUntil: `${Math.floor(timeUntilNotification / (1000 * 60 * 60))}h ${Math.floor((timeUntilNotification % (1000 * 60 * 60)) / (1000 * 60))}m`
      });
    } catch (error) {
      console.error('Schedule update error:', error);
      throw error;
    }
  }

  async testNotification(): Promise<void> {
    try {
      await this.ensureInitialized();
      
      if (Notification.permission !== 'granted') {
        const permission = await this.requestPermission();
        if (!permission) {
          throw new Error('Notification permission not granted');
        }
      }

      await this.showSystemNotification('Bonsai Care Test Notification', {
        body: 'If you see this, notifications are working correctly!',
        tag: 'test'
      });
    } catch (error) {
      debug.error('Test notification failed:', error);
      throw error;
    }
  }

  async testScheduledNotification(): Promise<void> {
    try {
      await this.updateMaintenanceSchedule(
        'test-tree',
        'Test Tree',
        'pruning',
        true,
        undefined,
        { 
          hours: new Date().getHours(),
          minutes: new Date().getMinutes() + 1 
        }
      );
    } catch (error) {
      debug.error('Test scheduled notification failed:', error);
      throw error;
    }
  }

  private clearAllTimers(): void {
    Object.values(this.notificationTimers).forEach(timer => clearTimeout(timer));
    this.notificationTimers = {};
  }
}

export const notificationService = new NotificationService();