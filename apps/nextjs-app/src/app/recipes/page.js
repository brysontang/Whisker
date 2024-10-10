'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Search, Plus, ChevronRight } from 'lucide-react';

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getRecipes().then(setRecipes);
  }, []);

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 text-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-parchment border-4 border-gray-300 rounded-lg shadow-lg p-8"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold mb-8 text-gray-900 pb-4 text-center"
          >
            Your Recipe Collection
          </motion.h1>

          <motion.div variants={itemVariants} className="mb-8 flex gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-amber-500 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-amber-600 transition duration-300"
            >
              <Plus size={20} />
              Add Recipe
            </motion.button>
          </motion.div>

          <motion.ul variants={containerVariants} className="space-y-4">
            <AnimatePresence>
              {filteredRecipes.map((recipe, index) => (
                <motion.li
                  key={recipe._id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ delay: index * 0.1 }}
                  className="bg-amber-50 rounded-lg p-4 shadow-md hover:shadow-lg transition duration-300"
                >
                  <Link
                    href={`/recipes/${recipe._id}`}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {recipe.emoji} {recipe.title}
                      </h2>
                      <p className="text-gray-600">
                        By {recipe.author || 'Unknown Chef'}
                      </p>
                    </div>
                    <ChevronRight className="text-amber-500" />
                  </Link>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>

          {filteredRecipes.length === 0 && (
            <motion.p
              variants={itemVariants}
              className="text-center text-gray-500 mt-8"
            >
              No recipes found. Try a different search or add a new recipe!
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
