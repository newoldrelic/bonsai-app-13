import { debug } from './debug';

export const checkOpenAIConfig = () => {
  debug.info('Checking OpenAI configuration...');
  
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    debug.error('OPENAI_API_KEY is missing');
    return false;
  }

  debug.debug('API Key format:', {
    length: apiKey.length,
    prefix: apiKey.substring(0, 3),
    isValid: apiKey.startsWith('sk-')
  });

  return true;
};