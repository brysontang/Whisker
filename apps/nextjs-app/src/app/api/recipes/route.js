import { NextResponse } from 'next/server';
import { extractInformation } from '@/utils/extract-information';
import { endpointWrapper } from '@/utils/endpoint-wrapper';

export const POST = endpointWrapper(async (request, db) => {
  // Parse new recipe from request
  const body = await request.json();
  const { url, recipeText, instructions } = body;

  const { result, cost } = await extractInformation(recipeText, instructions);

  // Save the recipe to the database
  const collection = db.collection('recipes');
  await collection.insertOne({ url, ...result, cost });

  return { message: 'Recipe saved successfully', url };
});

export const GET = endpointWrapper(async (request, db) => {
  // Get query parameters
  const { searchParams } = new URL(request.url);
  const fields = searchParams.get('fields');

  // Prepare projection object
  const projection = {};
  if (fields) {
    fields.split(',').forEach((field) => {
      projection[field.trim()] = 1;
    });
  }

  // Fetch recipes from the database with projection
  const collection = db.collection('recipes');
  const recipes = await collection
    .find({}, { projection })
    .sort({ createdAt: -1 })
    .toArray();

  return recipes;
});

export const OPTIONS = endpointWrapper(async () => {
  return new NextResponse(null, { status: 204 });
});
