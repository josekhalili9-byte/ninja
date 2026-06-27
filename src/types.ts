export type IngredientCategory = 'Frutas' | 'Lácteos' | 'Endulzantes' | 'Chocolates' | 'Extras';

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
}

export interface Recipe {
  id: string;
  name: string;
  type: string;
  difficulty: 'Fácil' | 'Media' | 'Difícil';
  time: string;
  ingredients: string[];
  instructions: string[];
  program: string;
  respins: number;
  mixins: string[];
  tips: string;
  macros: {
    calories: number;
    protein: string;
    carbs: string;
    fats: string;
  };
  tags: string[];
  imageUrl?: string;
  createdAt: number;
}
