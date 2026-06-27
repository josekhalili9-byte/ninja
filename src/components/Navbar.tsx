import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Moon, Sun, IceCream, Heart, Settings } from 'lucide-react';

export default function Navbar() {
  const { theme, setTheme, siteName, accentColor } = useApp();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-white/40 dark:border-slate-700/40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-blue-900/20" style={{ backgroundColor: accentColor }}>
              <IceCream className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white italic">
              {siteName}
            </span>
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <Link 
              to="/favorites" 
              className={`p-2 rounded-full transition-colors ${isActive('/favorites') ? 'bg-slate-200 dark:bg-slate-800' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              title="Mis recetas favoritas"
            >
              <Heart className={`w-5 h-5 ${isActive('/favorites') ? 'fill-red-500 text-red-500' : 'text-slate-600 dark:text-slate-300'}`} />
            </Link>

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
              title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <Link 
              to="/admin" 
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-semibold ${isActive('/admin') ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white' : 'bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline-block tracking-wider">ADMINISTRADOR</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
