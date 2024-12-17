// Debug configuration
//export const DEBUG_LEVELS = import.meta.env.VITE_DEBUG_LEVELS || '0';
export const DEBUG_LEVELS = process.env.VITE_DEBUG_LEVELS || '0';
// OpenAI configuration
export const OPENAI_CONFIG = {
  model: 'gpt-4o',
  maxTokens: 50
} as const;