'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const defaultRecipe = [
  'Marinade the chicken in 2 teaspoons soy sauce.',
  'Cut up green onion and any vegetables.',
  'Beat 3-4 eggs in bowl.',
  'Mix 1 tablespoon of corn starch and 2 tablespoons of water (cold or room temp).',
  'Add oil to pan and add chicken. Cook for 3-4 minutes on each side until the chicken is cooked all the way through.',
  'Take chicken out and put onto cutting board.',
  'Add garlic and green onion white part to same pan, cook until fragrant then cook vegetables.',
  'Add 4 cups of chicken broth.',
  'Scrape off burnt chicken from the bottom then bring broth to boil.',
  'Cube chicken.',
  'Once soup is boiling, add 2 cups of corn and 2 teaspoons of soy sauce.',
  'Once it starts to simmer, bring temperature to low and add corn starch water.',
  'Drizzle in egg.',
  'Add chicken and drippings back into soup.',
  'Add green onions, pepper, and a drizzle of sesame oil.',
];

function RecipeStepList({ steps, showFinished }) {
  const [closedSteps, setClosedSteps] = useState([]);

  return (
    <ol className="space-y-4">
      {steps.map((step, index) => (
        <StepItem
          key={index}
          step={step}
          index={index}
          isOpen={!closedSteps.includes(index)}
          isCompleted={false}
          onToggle={() => {
            setClosedSteps(
              closedSteps.includes(index)
                ? closedSteps.filter((i) => i !== index)
                : [...closedSteps, index]
            );
          }}
          showFinished={showFinished}
        />
      ))}
    </ol>
  );
}

export default function TestPromptPage() {
  const [prompt, setPrompt] = useState('');
  const [modifiedRecipe, setModifiedRecipe] = useState([]);
  const [showFinished, setShowFinished] = useState(false);

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/recipes/test-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          recipe: JSON.stringify(defaultRecipe),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to modify recipe');
      }

      const data = await response.json();
      setModifiedRecipe(data.steps);
    } catch (err) {
      console.error('Error modifying recipe:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 text-gray-900 p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="flex gap-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt to modify the recipe..."
              className="flex-1 p-4 rounded-lg border-2 border-sepia-300 bg-parchment shadow-md focus:outline-none focus:ring-2 focus:ring-sepia-400"
              rows={4}
            />
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-sepia-200 text-gray-900 rounded-full text-lg font-medium hover:bg-sepia-300 transition duration-300 h-fit"
            >
              Submit
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Original Recipe Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-parchment-light rounded-lg p-6 border border-sepia-200 shadow-md"
          >
            <h2 className="text-3xl font-serif font-bold mb-6 text-gray-900 border-b border-sepia-300 pb-2">
              Original Recipe
            </h2>
            <RecipeStepList steps={defaultRecipe} showFinished={showFinished} />
          </motion.div>

          {/* Modified Recipe Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-parchment-light rounded-lg p-6 border border-sepia-200 shadow-md"
          >
            <h2 className="text-3xl font-serif font-bold mb-6 text-gray-900 border-b border-sepia-300 pb-2">
              Modified Recipe
            </h2>
            {modifiedRecipe.length > 0 ? (
              <RecipeStepList
                steps={modifiedRecipe}
                showFinished={showFinished}
              />
            ) : (
              <p className="text-center text-gray-600 italic mt-8">
                Enter a prompt above to see the modified recipe
              </p>
            )}
          </motion.div>
        </div>
      </div>
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
    <motion.li
      layout
      className="bg-parchment rounded-lg overflow-hidden transition-all duration-300 ease-in-out border border-sepia-200 shadow-sm"
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-4 flex items-center justify-between focus:outline-none hover:bg-sepia-100 transition-colors duration-200"
      >
        <span
          className={`text-xl ${
            isCompleted ? 'line-through text-gray-600' : 'text-gray-900'
          }`}
        >
          Step {index + 1}
        </span>
        <motion.svg
          animate={{ rotate: isOpen || showFinished ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-6 h-6"
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
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {(showFinished || isOpen) && (
          <motion.div
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={{
              expanded: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-sepia-200"
          >
            <div className="p-4">
              <p className="text-gray-900 text-lg font-handwritten">{step}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}
