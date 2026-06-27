import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { IngredientCategory } from '../types';

export default function IngredientSelector() {
  const { ingredients, categories, selectedIngredientIds, toggleIngredient, accentColor } = useApp();

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-700/50 p-6 md:p-8 rounded-[32px] shadow-sm">
      {categories.map(category => {
        const catIngredients = ingredients.filter(i => i.category === category);
        if (catIngredients.length === 0) return null;

        return (
          <div key={category} className="flex flex-col gap-3">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-3 border-b border-slate-200/50 dark:border-slate-700/50 pb-2">
              {category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {catIngredients.map(ing => {
                const isSelected = selectedIngredientIds.includes(ing.id);
                return (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    key={ing.id}
                    onClick={() => toggleIngredient(ing.id)}
                    style={{
                      backgroundColor: isSelected ? accentColor : undefined,
                      borderColor: isSelected ? accentColor : undefined,
                    }}
                    className={`
                      px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                      ${isSelected 
                        ? 'text-white shadow-md' 
                        : 'bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm'
                      }
                    `}
                  >
                    {ing.name}
                  </motion.button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
