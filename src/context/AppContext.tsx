import React, { createContext, useContext, useEffect, useState } from 'react';
import { Ingredient, Recipe, IngredientCategory } from '../types';
import { INITIAL_INGREDIENTS } from '../lib/data';
import { db } from '../lib/firebase';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';

interface AppState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  siteName: string;
  setSiteName: (name: string) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  logoUrl: string;
  setLogoUrl: (url: string) => void;
  
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  selectedIngredientIds: string[];
  toggleIngredient: (id: string) => void;
  clearSelection: () => void;
  
  recipesHistory: Recipe[];
  addRecipesToHistory: (recipes: Recipe[]) => void;
  removeRecipeFromHistory: (id: string) => void;
  
  favoriteRecipeIds: string[];
  toggleFavorite: (id: string) => void;

  categories: IngredientCategory[];
  setCategories: React.Dispatch<React.SetStateAction<IngredientCategory[]>>;
  
  firebaseLoaded: boolean;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('creami-theme') as 'light' | 'dark') || 'light';
  });

  const [siteName, setSiteName] = useState(() => localStorage.getItem('creami-sitename') || 'Creami AI');
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('creami-color') || '#3b82f6');
  const [logoUrl, setLogoUrl] = useState(() => localStorage.getItem('creami-logo') || '');

  const [ingredients, setIngredients] = useState<Ingredient[]>(() => {
    const saved = localStorage.getItem('creami-ingredients');
    return saved ? JSON.parse(saved) : INITIAL_INGREDIENTS;
  });
  
  const [categories, setCategories] = useState<IngredientCategory[]>(() => {
    const saved = localStorage.getItem('creami-categories');
    return saved ? JSON.parse(saved) : ['Frutas', 'Lácteos', 'Endulzantes', 'Chocolates', 'Extras'];
  });

  const [selectedIngredientIds, setSelectedIngredientIds] = useState<string[]>([]);
  const [recipesHistory, setRecipesHistory] = useState<Recipe[]>([]);
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<string[]>([]);
  const [firebaseLoaded, setFirebaseLoaded] = useState(false);
  const [userId, setUserId] = useState<string>(() => {
    let id = localStorage.getItem('creami-user-id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('creami-user-id', id);
    }
    return id;
  });

  // Sync with Firestore
  useEffect(() => {
    if (!userId) return;

    const docRef = doc(db, 'users', userId);
    
    // Set initial empty doc if it doesn't exist
    setDoc(docRef, { }, { merge: true }).catch(console.error);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.history) setRecipesHistory(data.history);
        if (data.favorites) setFavoriteRecipeIds(data.favorites);
      }
      setFirebaseLoaded(true);
    }, (error) => {
      console.error('Error fetching data from Firestore:', error);
      setFirebaseLoaded(true);
    });

    return () => unsubscribe();
  }, [userId]);

  // Effects for local persistence
  useEffect(() => { localStorage.setItem('creami-theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('creami-sitename', siteName); }, [siteName]);
  useEffect(() => { localStorage.setItem('creami-color', accentColor); }, [accentColor]);
  useEffect(() => { localStorage.setItem('creami-logo', logoUrl); }, [logoUrl]);
  useEffect(() => { localStorage.setItem('creami-ingredients', JSON.stringify(ingredients)); }, [ingredients]);
  useEffect(() => { localStorage.setItem('creami-categories', JSON.stringify(categories)); }, [categories]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleIngredient = (id: string) => {
    setSelectedIngredientIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const clearSelection = () => setSelectedIngredientIds([]);

  const addRecipesToHistory = (recipes: Recipe[]) => {
    const newHistory = [...recipes, ...recipesHistory];
    setRecipesHistory(newHistory);
    if (userId) {
      updateDoc(doc(db, 'users', userId), { history: newHistory }).catch(console.error);
    }
  };
  
  const removeRecipeFromHistory = (id: string) => {
    const newHistory = recipesHistory.filter(r => r.id !== id);
    setRecipesHistory(newHistory);
    if (userId) {
      updateDoc(doc(db, 'users', userId), { history: newHistory }).catch(console.error);
    }
  };

  const toggleFavorite = (id: string) => {
    const newFavorites = favoriteRecipeIds.includes(id) 
      ? favoriteRecipeIds.filter(i => i !== id) 
      : [...favoriteRecipeIds, id];
    setFavoriteRecipeIds(newFavorites);
    if (userId) {
      updateDoc(doc(db, 'users', userId), { favorites: newFavorites }).catch(console.error);
    }
  };

  return (
    <AppContext.Provider value={{
      theme, setTheme,
      siteName, setSiteName,
      accentColor, setAccentColor,
      logoUrl, setLogoUrl,
      ingredients, setIngredients,
      selectedIngredientIds, toggleIngredient, clearSelection,
      recipesHistory, addRecipesToHistory, removeRecipeFromHistory,
      favoriteRecipeIds, toggleFavorite,
      categories, setCategories,
      firebaseLoaded
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
