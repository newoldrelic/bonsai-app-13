import type { HandlerEvent, HandlerResponse } from '@netlify/functions';
import OpenAI from 'openai';
import { debug } from '../../src/utils/debug';
import { checkOpenAIConfig } from '../../src/utils/openai';

export const handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  if (!checkOpenAIConfig()) {
    debug.error('OpenAI API is not properly configured');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'OpenAI API is not properly configured. Please check environment variables.' })
    };
  }

  try {
    debug.info('Initializing OpenAI client...');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    debug.info('Making test API call...');
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Test connection" }],
      max_tokens: 5
    });

    debug.info('API call successful');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        model: "gpt-3.5-turbo",
        response: response.choices[0]?.message?.content
      })
    };
  } catch (error: unknown) {
    debug.error('OpenAI test error:', error);
    
    let errorMessage = 'API test failed';
    let statusCode = 500;

    if (error instanceof Error) {
      if ((error as any).status === 401) {
        errorMessage = 'Invalid API key';
        statusCode = 401;
      } else if ((error as any).status === 404) {
        errorMessage = 'Model not available for this API key';
        statusCode = 404;
      } else {
        errorMessage = error.message;
      }
    }

    return {
      statusCode,
      headers,
      body: JSON.stringify({ 
        error: errorMessage,
        details: error instanceof Error ? error.message : undefined
      })
    };
  }
};