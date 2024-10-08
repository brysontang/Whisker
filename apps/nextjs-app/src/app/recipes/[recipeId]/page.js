'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function RecipePage({ params }) {
  const { recipeId } = params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/recipes/${recipeId}`,
          { cache: 'no-store' }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch recipe');
        }
        const data = await response.json();
        setRecipe(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [recipeId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-amber-50 text-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link
          href="/recipes"
          className="inline-block mb-6 px-4 py-2 bg-sepia-200 text-gray-900 rounded-full text-lg font-medium hover:bg-sepia-300 transition duration-300"
        >
          ← Back to Recipes
        </Link>
        <div className="bg-parchment border-4 border-sepia-300 rounded-lg shadow-lg p-8">
          <RecipeHeader
            title={recipe.title}
            author={recipe.author}
            emoji={recipe.emoji}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <IngredientsList ingredients={recipe.ingredients} />
            <InstructionsList steps={recipe.steps} />
          </div>
          <RecipeFooter url={recipe.url} cost={recipe.cost} />
        </div>
      </div>
    </div>
  );
}

function RecipeHeader({ title, author, emoji }) {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-serif font-bold mb-4 text-gray-900 border-b-2 border-sepia-300 pb-4">
        {emoji} {title}
      </h1>
      <p className="text-xl text-gray-800 font-handwritten">
        From the kitchen of {author || 'Grandma'}
      </p>
    </div>
  );
}

function IngredientsList({ ingredients }) {
  return (
    <div className="bg-parchment-light rounded-lg p-6 border border-sepia-200">
      <h2 className="text-2xl font-serif font-bold mb-4 text-gray-900 border-b border-sepia-300 pb-2">
        Ingredients
      </h2>
      <ul className="space-y-2">
        {ingredients.map((ingredient, index) => (
          <li
            key={index}
            className="flex items-center text-lg font-handwritten"
          >
            <span className="w-2 h-2 bg-sepia-400 rounded-full mr-3 inline-block"></span>
            <span className="font-bold text-gray-900">{ingredient.name}</span>
            <span className="ml-2 text-gray-800">{ingredient.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InstructionsList({ steps }) {
  const [openSteps, setOpenSteps] = useState([]);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [showFinished, setShowFinished] = useState(false);

  useEffect(() => {
    setOpenSteps(steps.map((_, index) => index));
  }, [steps]);

  const handleStepToggle = (toggledIndex) => {
    setCompletedSteps((prevCompletedSteps) => {
      if (prevCompletedSteps.includes(toggledIndex)) {
        setOpenSteps((prevOpenSteps) => [...prevOpenSteps, toggledIndex]);
        return prevCompletedSteps.filter((index) => index !== toggledIndex);
      } else {
        setOpenSteps((prevOpenSteps) =>
          prevOpenSteps.filter((index) => index !== toggledIndex)
        );
        return [...prevCompletedSteps, toggledIndex];
      }
    });
  };

  return (
    <div className="bg-parchment-light rounded-lg p-6 border border-sepia-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-serif font-bold text-gray-900 border-b border-sepia-300 pb-2">
          Instructions
        </h2>
        <button
          onClick={() => setShowFinished(!showFinished)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition duration-300 ${
            showFinished
              ? 'bg-transparent text-gray-800 border border-sepia-400 hover:bg-sepia-100'
              : 'bg-sepia-200 text-gray-900 hover:bg-sepia-300'
          }`}
        >
          {showFinished ? 'Hide Finished' : 'Show Finished'}
        </button>
      </div>
      <ol className="space-y-4 font-handwritten">
        {steps.map((step, index) => (
          <StepItem
            key={index}
            step={step}
            index={index}
            isOpen={openSteps.includes(index)}
            isCompleted={completedSteps.includes(index)}
            onToggle={() => handleStepToggle(index)}
            showFinished={showFinished}
          />
        ))}
      </ol>
    </div>
  );
}

function StepItem({
  step,
  index,
  isOpen,
  isCompleted,
  onToggle,
  showFinished,
}) {
  return (
    <li className="bg-parchment rounded-lg overflow-hidden transition-all duration-300 ease-in-out border border-sepia-200">
      <button
        onClick={onToggle}
        className="w-full text-left p-4 flex items-center justify-between focus:outline-none"
      >
        <span
          className={`text-lg ${
            isCompleted ? 'line-through text-gray-600' : 'text-gray-900'
          }`}
        >
          Step {index + 1}
        </span>
        <svg
          className={`w-6 h-6 transition-transform duration-300 ${
            isOpen || showFinished ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {(showFinished || isOpen) && (
        <div className="p-4 border-t border-sepia-200">
          <p className="text-gray-900">{step}</p>
        </div>
      )}
    </li>
  );
}

function RecipeFooter({ url, cost }) {
  return (
    <div className="mt-12 text-center">
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-sepia-200 text-gray-900 rounded-full text-lg font-medium hover:bg-sepia-300 transition duration-300 mb-4"
        >
          View Original Recipe
        </a>
      )}
      {cost > 0 && (
        <p className="text-xl text-gray-800 font-handwritten">
          Estimated cost: <span className="font-bold">${cost.toFixed(2)}</span>
        </p>
      )}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen bg-amber-50">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-600"></div>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div className="flex justify-center items-center h-screen bg-amber-50">
      <div className="bg-red-100 text-red-900 px-6 py-4 rounded-lg shadow-lg border border-red-200">
        <p className="text-lg font-medium">Oops! {message}</p>
      </div>
    </div>
  );
}
