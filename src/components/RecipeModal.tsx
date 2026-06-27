import React, { useEffect } from 'react';
import { Recipe } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Settings, RotateCcw, Plus, Info, Flame, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
}

export default function RecipeModal({ recipe, onClose }: RecipeModalProps) {
  const { favoriteRecipeIds, toggleFavorite, accentColor } = useApp();

  useEffect(() => {
    if (recipe) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [recipe]);

  if (!recipe) return null;

  const isFavorite = favoriteRecipeIds.includes(recipe.id);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[32px] shadow-2xl shadow-blue-200/50 dark:shadow-slate-900/50 border border-white/50 dark:border-slate-700/50 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 px-8 py-6 border-b border-white/40 dark:border-slate-700/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md flex justify-between items-center">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white truncate pr-4">
              {recipe.name}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => toggleFavorite(recipe.id)}
                className="p-3 bg-white/80 dark:bg-slate-800/80 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm"
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
              </button>
              <button
                onClick={onClose}
                className="p-3 bg-white/80 dark:bg-slate-800/80 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm"
              >
                <X className="w-6 h-6 text-slate-500 dark:text-slate-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto p-6 space-y-8">
            
            {/* Top Meta */}
            <div className="flex flex-wrap gap-4 text-sm font-medium">
              <span className="px-4 py-2 rounded-lg font-bold text-xs uppercase bg-white/60 dark:bg-slate-800/60 shadow-sm border border-white/40 text-slate-700 dark:text-slate-300">
                {recipe.type}
              </span>
              <span className="px-4 py-2 rounded-lg font-bold text-xs uppercase bg-white/60 dark:bg-slate-800/60 shadow-sm border border-white/40 text-slate-700 dark:text-slate-300">
                {recipe.difficulty}
              </span>
              <span className="px-4 py-2 rounded-lg font-bold text-xs uppercase bg-white/60 dark:bg-slate-800/60 shadow-sm border border-white/40 text-slate-700 dark:text-slate-300">
                {recipe.time}
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map(tag => (
                <span key={tag} className="text-[10px] font-bold px-3 py-1 bg-white/80 dark:bg-slate-800/80 shadow-sm text-slate-500 dark:text-slate-400 rounded-lg whitespace-nowrap border border-slate-100 dark:border-slate-700/50">
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Ingredients & Mixins */}
              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                    <Check className="w-5 h-5 text-green-500" /> Ingredientes
                  </h3>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ing, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-300 text-sm">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
                        {ing}
                      </li>
                    ))}
                  </ul>
                </section>

                {recipe.mixins && recipe.mixins.length > 0 && (
                  <section>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                      <Plus className="w-5 h-5" style={{ color: accentColor }} /> Mix-ins
                    </h3>
                    <ul className="space-y-2">
                      {recipe.mixins.map((mixin, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-300 text-sm">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
                          {mixin}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>

              {/* Instructions & Creami Settings */}
              <div className="space-y-6">
                <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-[24px] p-6 border border-white/60 dark:border-slate-700/50 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Settings className="w-4 h-4" /> Configuración Creami
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Programa:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{recipe.program}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <RotateCcw className="w-4 h-4" /> Re-spins recomendados:
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">{recipe.respins}</span>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Instrucciones</h3>
                  <ol className="space-y-4">
                    {recipe.instructions.map((step, i) => (
                      <li key={i} className="flex gap-4 text-sm text-slate-700 dark:text-slate-300">
                        <span className="font-bold text-slate-400 dark:text-slate-500 shrink-0">{i + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </section>
              </div>
            </div>

            {/* Footer / Macros & Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {recipe.tips && (
                <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-4 flex gap-3">
                  <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700 dark:text-slate-300">{recipe.tips}</p>
                </div>
              )}
              
              {recipe.macros && (
                <div className="bg-orange-50/50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2 text-orange-600 dark:text-orange-400 font-semibold text-sm">
                    <Flame className="w-4 h-4" /> Valor Nutricional (aprox)
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{recipe.macros.calories}</div>
                      <div className="text-slate-500">kcal</div>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{recipe.macros.protein}</div>
                      <div className="text-slate-500">prot</div>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{recipe.macros.carbs}</div>
                      <div className="text-slate-500">carb</div>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{recipe.macros.fats}</div>
                      <div className="text-slate-500">grasas</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
