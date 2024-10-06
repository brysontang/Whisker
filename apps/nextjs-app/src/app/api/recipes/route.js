import { recipes } from '../../data/recipes'; // Replace with DB access in production
import { NextResponse } from 'next/server';

export async function POST(request) {
  // Parse new recipe from request
  const newRecipe = await request.json();
  console.log('newRecipe', newRecipe);
  // For now, just add it to an array
  recipes.push(newRecipe);

  return NextResponse.json(
    { message: 'Recipe saved successfully', newRecipe },
    { status: 201 }
  );
}

export async function GET() {
  // Return all saved recipes
  return NextResponse.json(recipes);
}
