import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import IngredientSelector from '../components/IngredientSelector';
import RecipeCard from '../components/RecipeCard';
import RecipeModal from '../components/RecipeModal';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Dices, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Recipe } from '../types';

export default function Home() {
  const { ingredients, selectedIngredientIds, addRecipesToHistory, recipesHistory, accentColor } = useApp();
  
  const [loading, setLoading] = useState(false);
  const [currentRecipes, setCurrentRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState('');
  const [selectedRecipeType, setSelectedRecipeType] = useState<string>('');

  const creamiTypes = [
    { id: 'ice-cream', label: 'Helado' },
    { id: 'gelato', label: 'Gelato' },
    { id: 'lite-ice-cream', label: 'Lite Ice Cream' },
    { id: 'milkshake', label: 'Milkshake' },
    { id: 'sorbet', label: 'Sorbet' },
    { id: 'smoothie-bowl', label: 'Smoothie Bowl' },
  ];

  const generateRecipes = async (type: 'normal' | 'surprise') => {
    if (type === 'normal' && selectedIngredientIds.length === 0) {
      setError('Por favor selecciona al menos un ingrediente.');
      return;
    }

    setError('');
    setLoading(true);
    setCurrentRecipes([]);

    const selectedNames = ingredients
      .filter(i => selectedIngredientIds.includes(i.id))
      .map(i => i.name);

    try {
      const response = await fetch('/api/generate-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: selectedNames, type, recipeType: selectedRecipeType })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || 'Error al generar recetas');
      }
      
      const data = await response.json();
      
      if (data.recipes) {
        const recipesWithMeta = data.recipes.map((r: any) => ({
          ...r,
          id: uuidv4(),
          createdAt: Date.now()
        }));
        setCurrentRecipes(recipesWithMeta);
        addRecipesToHistory(recipesWithMeta);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocurrió un error al conectar con la IA. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-12 w-full pb-20">
      
      {/* Hero Section */}
      <section className="text-center space-y-6 mt-8 w-full">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight"
        >
          ¿Qué ingredientes tienes?
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
        >
          Selecciona lo que hay en tu cocina y deja que la IA cree la receta perfecta para tu Ninja Creami.
        </motion.p>
      </section>

      {/* Ingredient Selector */}
      <section className="w-full">
        <IngredientSelector />
      </section>

      {/* Recipe Type Selector */}
      <section className="w-full max-w-4xl mx-auto px-4">
        <div className="bg-white/40 dark:bg-slate-800/40 rounded-3xl p-6 sm:p-8 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
            🍨 Tipo de Receta <span className="text-sm font-normal text-slate-500">(Opcional)</span>
          </h2>
          <div className="flex flex-wrap gap-3">
            {creamiTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedRecipeType(type.label === selectedRecipeType ? '' : type.label)}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                  selectedRecipeType === type.label
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700/50 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full sticky bottom-6 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => generateRecipes('normal')}
          disabled={loading || selectedIngredientIds.length === 0}
          className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg shadow-xl shadow-blue-200 dark:shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
          {loading ? 'Generando...' : '✨ Generar recetas'}
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => generateRecipes('surprise')}
          disabled={loading}
          className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-white/50 dark:border-slate-700/50 text-blue-600 dark:text-blue-400 font-bold text-lg shadow-xl shadow-blue-100/50 dark:shadow-none hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-all"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Dices className="w-6 h-6" />}
          🎲 Sorpréndeme
        </motion.button>
      </section>

      {error && (
        <div className="text-red-500 font-medium bg-red-50 dark:bg-red-900/20 px-6 py-3 rounded-2xl">
          {error}
        </div>
      )}

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.section 
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/40 dark:bg-slate-800/40 rounded-3xl p-6 h-[250px] animate-pulse">
                <div className="w-20 h-6 bg-slate-200 dark:bg-slate-700 rounded-full mb-4"></div>
                <div className="w-3/4 h-8 bg-slate-200 dark:bg-slate-700 rounded-xl mb-3"></div>
                <div className="w-1/2 h-4 bg-slate-200 dark:bg-slate-700 rounded-lg mb-6"></div>
                <div className="flex gap-4">
                  <div className="w-16 h-4 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                  <div className="w-16 h-4 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                </div>
              </div>
            ))}
          </motion.section>
        ) : currentRecipes.length > 0 ? (
          <motion.section 
            key="results"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mt-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="text-amber-400" /> Recetas Generadas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentRecipes.map(recipe => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  onClick={() => setSelectedRecipe(recipe)} 
                />
              ))}
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
    </div>
  );
}
