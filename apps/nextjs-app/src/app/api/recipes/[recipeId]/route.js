import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { endpointWrapper } from '@/lib/endpoint-wrapper';

export const GET = endpointWrapper(async (request, db, { params }) => {
  const { recipeId } = params;

  if (!ObjectId.isValid(recipeId)) {
    return NextResponse.json({ error: 'Invalid recipe ID' }, { status: 400 });
  }

  const collection = db.collection('recipes');
  const recipe = await collection.findOne({ _id: new ObjectId(recipeId) });

  if (!recipe) {
    return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
  }

  return NextResponse.json(recipe);
});

export const OPTIONS = endpointWrapper(async () => {
  return new NextResponse(null, { status: 204 });
});
