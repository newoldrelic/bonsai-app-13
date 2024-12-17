import { openai } from '../config/openai';
import { AI_PROMPTS } from '../config/ai-prompts';

export async function identifySpecies(imageData: string): Promise<string> {
  // Extract base64 data by splitting on the comma
  const base64Image = imageData.includes(',') ? imageData.split(',')[1] : imageData;
  
  const response = await openai.chat.completions.create({
    model: AI_PROMPTS.speciesIdentification.model,
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
              url: `data:image/jpeg;base64,${base64Image}`
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

  return species.trim();
}