import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';

import { calculateInputCost, calculateOutputCost } from './calculate-cost';

const openai = new OpenAI();

const Ingredient = z.object({
  name: z.string(),
  amount: z.string(),
});

const RecipeInfo = z.object({
  author: z.string(),
  ingredients: z.array(Ingredient),
  steps: z.array(z.string()),
});

export async function extractInformation(recipe) {
  const systemPrompt = `You are a helpful assistant that extracts information from recipes.`;
  const inputCost =
    calculateInputCost(recipe) + calculateOutputCost(systemPrompt);
  console.log('input cost', inputCost);

  try {
    const completion = await openai.beta.chat.completions.parse({
      model: 'gpt-4o-mini-2024-07-18',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: recipe },
      ],
      response_format: zodResponseFormat(RecipeInfo, 'recipe_info'),
    });

    const result = completion.choices[0].message.parsed;
    const outputCost = calculateOutputCost(result);

    console.log('output cost', outputCost);
    return { result, cost: inputCost + outputCost };
  } catch (error) {
    console.error('Error extracting information from recipe:', error);
    throw error;
  }
}
