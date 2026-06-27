import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { Lock, Settings, Trash, Plus, Save } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Ingredient } from '../types';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { 
    siteName, setSiteName, 
    accentColor, setAccentColor,
    ingredients, setIngredients,
    categories
  } = useApp();

  const [newIngredientName, setNewIngredientName] = useState('');
  const [newIngredientCategory, setNewIngredientCategory] = useState(categories[0]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '8718') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  const handleAddIngredient = () => {
    if (!newIngredientName.trim()) return;
    const newIng: Ingredient = {
      id: uuidv4(),
      name: newIngredientName.trim(),
      category: newIngredientCategory
    };
    setIngredients(prev => [...prev, newIng]);
    setNewIngredientName('');
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients(prev => prev.filter(i => i.id !== id));
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-8 rounded-[32px] shadow-xl w-full max-w-sm border border-white/50 dark:border-slate-700/50"
        >
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-white/80 dark:bg-slate-700/80 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Lock className="w-8 h-8 text-slate-500 dark:text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Administrador</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full px-4 py-3 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-white/50 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center tracking-widest font-mono text-xl shadow-inner transition-all"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold transition-transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-200 dark:shadow-blue-900/20"
            >
              Entrar
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-12 pb-20"
    >
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-6">
        <Settings className="w-8 h-8 text-slate-900 dark:text-white" />
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Panel de Control</h1>
      </div>

      <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-6 sm:p-8 rounded-[32px] shadow-sm border border-white/50 dark:border-slate-700/50">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Configuración del Sitio</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Nombre del Sitio
            </label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-white/50 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Color Principal
            </label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-12 h-12 rounded cursor-pointer"
              />
              <span className="text-slate-500 font-mono">{accentColor}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-6 sm:p-8 rounded-[32px] shadow-sm border border-white/50 dark:border-slate-700/50">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Administrar Ingredientes</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white/40 dark:bg-slate-900/40 p-4 rounded-[24px] border border-white/50 dark:border-slate-700/30">
          <input
            type="text"
            value={newIngredientName}
            onChange={(e) => setNewIngredientName(e.target.value)}
            placeholder="Nuevo ingrediente..."
            className="flex-1 px-4 py-3 rounded-2xl border border-white/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/70 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner"
          />
          <select
            value={newIngredientCategory}
            onChange={(e) => setNewIngredientCategory(e.target.value as any)}
            className="px-4 py-3 rounded-2xl border border-white/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/70 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button
            onClick={handleAddIngredient}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 dark:shadow-blue-900/20 active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5" /> Agregar
          </button>
        </div>

        <div className="space-y-6">
          {categories.map(category => {
            const catIngredients = ingredients.filter(i => i.category === category);
            if (catIngredients.length === 0) return null;
            return (
              <div key={category}>
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {catIngredients.map(ing => (
                    <div key={ing.id} className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 border border-white/50 dark:border-slate-700/50 px-3 py-1.5 rounded-xl text-sm shadow-sm">
                      <span>{ing.name}</span>
                      <button 
                        onClick={() => handleRemoveIngredient(ing.id)}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-1 rounded-lg transition-colors"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </motion.div>
  );
}
