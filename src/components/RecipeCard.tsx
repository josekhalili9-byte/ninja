import React from 'react';
import { Recipe } from '../types';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Heart, Clock, ChefHat, Info } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  key?: React.Key;
}

export default function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  const { favoriteRecipeIds, toggleFavorite, accentColor } = useApp();
  const isFavorite = favoriteRecipeIds.includes(recipe.id);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/60 dark:border-slate-700/50 rounded-[32px] overflow-hidden shadow-xl shadow-blue-100/50 dark:shadow-none cursor-pointer transition-all duration-300 hover:shadow-2xl hover:bg-white/70 dark:hover:bg-slate-800/70"
      onClick={onClick}
    >
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(recipe.id);
          }}
          className="p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm transition-transform hover:scale-110"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-500 dark:text-slate-400'}`} />
        </button>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 rounded-md text-[10px] font-bold uppercase mb-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300">
            {recipe.type}
          </span>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight mb-2 line-clamp-2">
            {recipe.name}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
            Con {recipe.ingredients.slice(0, 3).map(i => i.split(' ')[0]).join(', ')}...
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{recipe.time}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ChefHat className="w-4 h-4" />
            <span>{recipe.difficulty}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex flex-wrap gap-2">
          {recipe.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] font-bold px-3 py-1 bg-white dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800/50 rounded-lg whitespace-nowrap">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
