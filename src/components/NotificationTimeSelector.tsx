import React from 'react';
import { Clock } from 'lucide-react';
import { debug } from '../utils/debug';

interface NotificationTimeSelectorProps {
  value: { hours: number; minutes: number };
  onChange: (hours: number, minutes: number) => void;
}

export function NotificationTimeSelector({ value, onChange }: NotificationTimeSelectorProps) {
  const time = `${value.hours.toString().padStart(2, '0')}:${value.minutes.toString().padStart(2, '0')}`;

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    onChange(hours, minutes);
    debug.info('Notification time updated:', { hours, minutes });
  };

  return (
    <div className="flex items-center space-x-2">
      <Clock className="w-4 h-4 text-bonsai-green" />
      <input
        type="time"
        value={time}
        onChange={handleTimeChange}
        className="px-2 py-1 border border-stone-300 dark:border-stone-600 rounded focus:ring-2 focus:ring-bonsai-green focus:border-bonsai-green bg-white dark:bg-stone-900"
      />
    </div>
  );
}