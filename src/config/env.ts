export const ENV = {
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  STRIPE_SECRET_KEY: import.meta.env.VITE_STRIPE_SECRET_KEY,
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
  DEBUG_LEVELS: import.meta.env.VITE_DEBUG_LEVELS || '0'
} as const;

export const validateEnv = () => {
  const requiredVars = [
    'STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY',
    'OPENAI_API_KEY'
  ] as const;

  const missing = requiredVars.filter(key => !ENV[key]);

  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing.join(', '));
    return false;
  }

  return true;
};