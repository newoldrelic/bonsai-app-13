import type { HandlerEvent, HandlerResponse } from '@netlify/functions';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
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
    const { message, systemPrompt } = JSON.parse(event.body || '{}');
    
    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Message is required' })
      };
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No response received from AI');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ response: response.trim() })
    };

  } catch (error: unknown) {
    console.error('Chat error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to process chat message'
      })
    };
  }
};