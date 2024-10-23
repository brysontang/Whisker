import { NextResponse } from 'next/server';
import { extractInformation } from '@/lib/openai/extract-information';
import { endpointWrapper } from '@/lib/endpoint-wrapper';

export const POST = endpointWrapper(async (request) => {
  // Parse request body
  const body = await request.json();
  const { prompt, recipe } = body;

  // Extract modified recipe using the prompt as instructions
  const { result } = await extractInformation(recipe, prompt);

  // Return just the steps array for the frontend
  return NextResponse.json({ steps: result.steps });
});

export const OPTIONS = endpointWrapper(async () => {
  return new NextResponse(null, { status: 204 });
});
