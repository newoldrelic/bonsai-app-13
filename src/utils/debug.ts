import { DEBUG_LEVELS } from '../config/constants';

// Debug levels enum
export const DebugLevel = {
  NONE: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
  TRACE: 5
} as const;

// Current debug level - can be set via environment variable
const currentLevel = DEBUG_LEVELS ? parseInt(DEBUG_LEVELS, 10) : DebugLevel.NONE;

export const debug = {
  error: (...args: any[]) => currentLevel >= DebugLevel.ERROR && console.error('[ERROR]', ...args),
  warn: (...args: any[]) => currentLevel >= DebugLevel.WARN && console.warn('[WARN]', ...args),
  info: (...args: any[]) => currentLevel >= DebugLevel.INFO && console.info('[INFO]', ...args),
  debug: (...args: any[]) => currentLevel >= DebugLevel.DEBUG && console.debug('[DEBUG]', ...args),
  trace: (...args: any[]) => currentLevel >= DebugLevel.TRACE && console.trace('[TRACE]', ...args)
};