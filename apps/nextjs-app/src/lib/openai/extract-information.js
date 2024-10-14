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
  title: z.string(),
  ingredients: z.array(Ingredient),
  steps: z.array(z.string()),
  emoji: z.string(),
});

export async function extractInformation(recipe, instructions) {
  let systemPrompt = `You are a helpful assistant that extracts information from recipes.`;

  if (instructions) {
    systemPrompt += ` The user has provided the following instructions, please take this into account with the recipe extraction, title, and emoji. Also take into account how the recipe might subtly change: ${instructions}.`;
  }

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
    console.log('result', result);
    const outputCost = calculateOutputCost(JSON.stringify(result));

    // console.log('output cost', outputCost);
    return { result, cost: inputCost + outputCost };
  } catch (error) {
    console.error('Error extracting information from recipe:', error);
    throw error;
  }
}
