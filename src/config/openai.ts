import OpenAI from 'openai';

// We'll use server-side API calls through Netlify Functions
// This client is only used for type definitions
export const openai = new OpenAI({
  apiKey: 'placeholder',
  dangerouslyAllowBrowser: true
});