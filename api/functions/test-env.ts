import type { HandlerEvent, HandlerResponse } from '@netlify/functions';
import { debug } from '../../src/utils/debug';

export const handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  debug.info('Testing environment variables...');

  // Get all environment variables (safely)
  const envVars = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ? '****' + process.env.OPENAI_API_KEY.slice(-4) : undefined,
    DEBUG_LEVELS: process.env.DEBUG_LEVELS,
    NODE_ENV: process.env.NODE_ENV
  };

  debug.debug('Environment variables:', envVars);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      environment: process.env.NODE_ENV,
      variables: {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'Present' : 'Missing',
        DEBUG_LEVELS: process.env.DEBUG_LEVELS || 'Not set',
      },
      timestamp: new Date().toISOString()
    })
  };
};