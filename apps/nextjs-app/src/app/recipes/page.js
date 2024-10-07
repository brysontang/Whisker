import { endpointWrapper } from '@/utils/endpoint-wrapper';
import Link from 'next/link';

async function getRecipes() {
  const response = await fetch(
    'http://localhost:3000/api/recipes?fields=_id,title,author,emoji',
    { cache: 'no-store' }
  );
  if (!response.ok) {
    throw new Error('Failed to fetch recipes');
  }
  return response.json();
}

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return (
    <div className="min-h-screen bg-amber-50 text-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-parchment border-4 border-gray-300 rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-serif font-bold mb-8 text-gray-900 border-b-2 border-gray-300 pb-4 text-center">
            Recipes
          </h1>
          <ul className="space-y-4">
            {recipes.map((recipe) => (
              <li
                key={recipe._id}
                className="bg-parchment-light rounded-lg p-4 border border-gray-200 hover:shadow-md transition duration-300"
              >
                <Link href={`/recipes/${recipe._id}`} className="block">
                  <h2 className="text-2xl font-serif font-bold text-gray-800">
                    {recipe.emoji} {recipe.title}
                  </h2>
                  <p className="text-lg text-gray-700 font-handwritten">
                    From the kitchen of {recipe.author || 'Grandma'}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
