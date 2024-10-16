'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ExternalLink,
  DollarSign,
  AlertTriangle,
  Plus,
  Minus,
} from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

export default function RecipePage({ params }) {
  const { recipeId } = params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState({ color: '#FF0000', text: '' });
  const [isAddTagOpen, setIsAddTagOpen] = useState(false);

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

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`/api/recipes/${recipeId}/tags`);
        if (!response.ok) {
          throw new Error('Failed to fetch tags');
        }
        const data = await response.json();
        setTags(data);
      } catch (err) {
        console.error('Error fetching tags:', err);
      }
    };
    fetchTags();
  }, [recipeId]);

  const addTag = async () => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTag),
      });
      if (!response.ok) {
        throw new Error('Failed to add tag');
      }
      const addedTag = await response.json();
      setTags([...tags, addedTag]);
      setNewTag({ color: '#FF0000', text: '' });
      setIsAddTagOpen(false);
    } catch (err) {
      console.error('Error adding tag:', err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 text-gray-900"
    >
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Link
          href="/recipes"
          className="inline-flex items-center mb-6 px-4 py-2 bg-sepia-200 text-gray-900 rounded-full text-lg font-medium hover:bg-sepia-300 transition duration-300"
        >
          <ChevronLeft className="mr-2" />
          Back to Recipes
        </Link>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-parchment border-4 border-sepia-300 rounded-lg shadow-lg p-8"
        >
          <AIDisclaimer />
          <RecipeHeader
            title={recipe.title}
            author={recipe.author}
            emoji={recipe.emoji}
          />
          <TagSection
            tags={tags}
            isAddTagOpen={isAddTagOpen}
            setIsAddTagOpen={setIsAddTagOpen}
            newTag={newTag}
            setNewTag={setNewTag}
            addTag={addTag}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            <IngredientsList ingredients={recipe.ingredients} />
            <InstructionsList steps={recipe.steps} />
          </div>
          <RecipeFooter url={recipe.url} cost={recipe.cost} />
        </motion.div>
      </div>
    </motion.div>
  );
}

function TagSection({
  tags,
  isAddTagOpen,
  setIsAddTagOpen,
  newTag,
  setNewTag,
  addTag,
}) {
  const colorOptions = [
    '#FFB3BA', // Soft pink
    '#BAFFC9', // Soft green
    '#BAE1FF', // Soft blue
    '#FFFFBA', // Soft yellow
    '#FFDFBA', // Soft orange
    '#E6BAFF', // Soft purple
  ];

  const handleOpenAddTag = () => {
    setIsAddTagOpen(true);
  };

  const handleCloseAddTag = () => {
    setIsAddTagOpen(false);
  };

  return (
    <div className="mt-6">
      <h3 className="text-2xl font-serif font-bold mb-4 text-gray-900">Tags</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{ backgroundColor: tag.color, color: 'white' }}
          >
            {tag.text}
          </span>
        ))}
        <button
          onClick={handleOpenAddTag}
          className="px-3 py-1 rounded-full text-sm font-medium bg-sepia-200 text-gray-900 hover:bg-sepia-300 transition duration-300 flex items-center"
        >
          <Plus size={14} className="mr-1" />
          Add Tag
        </button>
      </div>
      {isAddTagOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-6 border border-sepia-300 mb-6"
        >
          <h4 className="text-xl font-bold mb-4">Add New Tag</h4>
          <input
            type="text"
            placeholder="Tag name"
            value={newTag.text}
            onChange={(e) => setNewTag({ ...newTag, text: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          />
          <div className="mb-4">
            <p className="mb-2">Select color:</p>
            <div className="flex gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewTag({ ...newTag, color })}
                  className={`w-8 h-8 rounded-full ${
                    newTag.color === color
                      ? 'ring-2 ring-offset-2 ring-gray-500'
                      : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCloseAddTag}
              className="px-4 py-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition duration-300"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                addTag();
                handleCloseAddTag();
              }}
              className="px-4 py-2 rounded-full bg-sepia-200 text-gray-900 hover:bg-sepia-300 transition duration-300"
            >
              Add Tag
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function AIDisclaimer() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8 rounded"
    >
      <div className="flex items-center">
        <AlertTriangle className="mr-2" size={24} />
        <p className="font-bold">AI-Generated Recipe Disclaimer</p>
      </div>
      <p className="mt-2">
        This recipe was generated by AI. Please triple-check all ingredients for
        potential allergens. Ensure all meats are cooked to the proper
        temperature as recommended by the
        <a
          href="https://www.fda.gov/food/buy-store-serve-safe-food/safe-food-handling"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline ml-1"
        >
          FDA&apos;s safe cooking temperature guidelines
        </a>
        .
      </p>
    </motion.div>
  );
}

function RecipeHeader({ title, author, emoji }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-center"
    >
      <h1 className="text-5xl font-serif font-bold mb-4 text-gray-900 border-b-2 border-sepia-300 pb-4">
        {emoji} {title}
      </h1>
      <p className="text-2xl text-gray-800 font-handwritten">
        From the kitchen of {author || 'Grandma'}
      </p>
    </motion.div>
  );
}

function IngredientsList({ ingredients }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-parchment-light rounded-lg p-6 border border-sepia-200 shadow-md"
    >
      <h2 className="text-3xl font-serif font-bold mb-6 text-gray-900 border-b border-sepia-300 pb-2">
        Ingredients
      </h2>
      <ul className="space-y-3">
        {ingredients.map((ingredient, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="flex items-center text-xl font-handwritten"
          >
            <span className="w-3 h-3 bg-sepia-400 rounded-full mr-4 inline-block"></span>
            <span className="font-bold text-gray-900">{ingredient.name}</span>
            <span className="ml-2 text-gray-800">{ingredient.amount}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
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
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-parchment-light rounded-lg p-6 border border-sepia-200 shadow-md"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-serif font-bold text-gray-900 border-b border-sepia-300 pb-2">
          Instructions
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFinished(!showFinished)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition duration-300 ${
            showFinished
              ? 'bg-transparent text-gray-800 border border-sepia-400 hover:bg-sepia-100'
              : 'bg-sepia-200 text-gray-900 hover:bg-sepia-300'
          }`}
        >
          {showFinished ? 'Hide Finished' : 'Show Finished'}
        </motion.button>
      </div>
      <ol className="space-y-4 font-handwritten">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <StepItem
              step={step}
              index={index}
              isOpen={openSteps.includes(index)}
              isCompleted={completedSteps.includes(index)}
              onToggle={() => handleStepToggle(index)}
              showFinished={showFinished}
            />
          </motion.div>
        ))}
      </ol>
    </motion.div>
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
              <p className="text-gray-900 text-lg">{step}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

function RecipeFooter({ url, cost }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mt-12 text-center"
    >
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 bg-sepia-200 text-gray-900 rounded-full text-lg font-medium hover:bg-sepia-300 transition duration-300 mb-4"
        >
          View Original Recipe
          <ExternalLink className="ml-2" size={18} />
        </a>
      )}
      {cost > 0 && (
        <p className="text-2xl text-gray-800 font-handwritten mt-4">
          Estimated cost:{' '}
          <span className="font-bold flex items-center justify-center">
            <DollarSign className="mr-1" size={24} />
            {cost.toFixed(2)}
          </span>
        </p>
      )}
    </motion.div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen bg-amber-50">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="rounded-full h-32 w-32 border-t-4 border-b-4 border-gray-900"
      ></motion.div>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div className="flex justify-center items-center h-screen bg-amber-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-red-100 text-red-900 px-8 py-6 rounded-lg shadow-lg border-2 border-red-300"
      >
        <p className="text-2xl font-medium">Oops! {message}</p>
        <p className="mt-2 text-lg">Please try again later.</p>
      </motion.div>
    </div>
  );
}
