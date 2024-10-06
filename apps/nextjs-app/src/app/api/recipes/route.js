import { recipes } from '../../data/recipes'; // Replace with DB access in production
import { NextResponse } from 'next/server';
import { calculateInputCost } from '../../utils/calculate-cost';

export async function POST(request) {
  // Parse new recipe from request
  const body = await request.json();
  const { title, url, recipeText } = body;
  console.log('title', title);
  console.log('url', url);
  console.log('recipeText', recipeText);
  // For now, just add it to an array
  recipes.push({ title, url, recipeText });

  const cost = calculateInputCost(recipeText);
  console.log('cost', cost);

  const response = NextResponse.json(
    { message: 'Recipe saved successfully', title, url },
    { status: 200 }
  );

  // Set CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  return response;
}

export async function GET(request) {
  const response = NextResponse.json(recipes);

  // Set CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  return response;
}

export async function OPTIONS(request) {
  const response = new NextResponse(null, { status: 204 });

  // Set CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  return response;
}
