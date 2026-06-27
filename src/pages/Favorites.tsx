import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import RecipeCard from '../components/RecipeCard';
import RecipeModal from '../components/RecipeModal';
import { motion } from 'motion/react';
import { Heart, Clock, HeartCrack } from 'lucide-react';
import { Recipe } from '../types';

export default function Favorites() {
  const { recipesHistory, favoriteRecipeIds } = useApp();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  
  const [activeTab, setActiveTab] = useState<'favorites' | 'history'>('favorites');

  const favorites = recipesHistory.filter(r => favoriteRecipeIds.includes(r.id));
  const history = recipesHistory;

  const currentList = activeTab === 'favorites' ? favorites : history;

  return (
    <div className="flex flex-col w-full pb-20">
      
      <div className="flex justify-center gap-4 mb-12">
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${activeTab === 'favorites' ? 'bg-white/80 dark:bg-slate-800/80 text-red-500 shadow-md border border-white/50 dark:border-slate-700/50' : 'bg-white/40 dark:bg-slate-900/40 text-slate-500 hover:bg-white/60 dark:hover:bg-slate-800/60 border border-transparent'}`}
        >
          <Heart className={`w-5 h-5 ${activeTab === 'favorites' ? 'fill-current' : ''}`} /> 
          Mis Favoritos
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${activeTab === 'history' ? 'bg-white/80 dark:bg-slate-800/80 text-blue-600 dark:text-blue-400 shadow-md border border-white/50 dark:border-slate-700/50' : 'bg-white/40 dark:bg-slate-900/40 text-slate-500 hover:bg-white/60 dark:hover:bg-slate-800/60 border border-transparent'}`}
        >
          <Clock className="w-5 h-5" /> 
          Historial
        </button>
      </div>

      {currentList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
          {activeTab === 'favorites' ? (
            <>
              <HeartCrack className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg">No tienes recetas favoritas aún.</p>
            </>
          ) : (
            <>
              <Clock className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg">No has generado ninguna receta.</p>
            </>
          )}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {currentList.map(recipe => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              onClick={() => setSelectedRecipe(recipe)} 
            />
          ))}
        </motion.div>
      )}

      <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
    </div>
  );
}
