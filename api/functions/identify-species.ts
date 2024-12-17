import type { HandlerEvent, HandlerResponse } from '@netlify/functions';
import OpenAI from 'openai';
import { debug } from '../../src/utils/debug';
import { checkOpenAIConfig } from '../../src/utils/openai';
import { AI_PROMPTS } from '../../src/config/ai-prompts';

export const handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }
  try {
    // Validate OpenAI configuration
    if (!checkOpenAIConfig()) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'OpenAI API is not properly configured' })
      };
    }
    // Validate request body
    if (!event.body) {
      debug.warn('No request body provided');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No image data provided' })
      };
    }
    // Parse request data
    let requestData;
    try {
      requestData = JSON.parse(event.body);
    } catch (e) {
      debug.error('Failed to parse request body:', e);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid request format' })
      };
    }
    const { image } = requestData;
    if (!image) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Image data is required' })
      };
    }
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    // Format image URL
    const imageUrl = image.startsWith('data:') 
      ? image 
      : `data:image/jpeg;base64,${image}`;
    // Make OpenAI API request
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: AI_PROMPTS.speciesIdentification.prompt
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ],
        },
      ],
      max_tokens: AI_PROMPTS.speciesIdentification.maxTokens
    });
    const species = response.choices[0]?.message?.content;
    if (!species) {
      throw new Error('No species identification received');
    }
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        species: species.trim(),
        success: true
      })
    };
  } catch (error: unknown) {
    debug.error('Species identification error:', error);
    
    let errorMessage = 'Failed to identify species';
    let statusCode = 500;
    
    if (error instanceof Error) {
      if ((error as any).status === 401) {
        statusCode = 401;
        errorMessage = 'OpenAI API authentication failed';
      } else if ((error as any).status === 429) {
        statusCode = 429;
        errorMessage = 'Too many requests. Please try again later';
      } else if (['ECONNREFUSED', 'ECONNRESET'].includes((error as any).code)) {
        statusCode = 503;
        errorMessage = 'Connection to OpenAI failed';
      }
    }
    
    return {
      statusCode,
      headers,
      body: JSON.stringify({ 
        error: errorMessage,
        success: false,
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : undefined) : undefined
      })
    };
  }
};