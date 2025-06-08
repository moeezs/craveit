export interface RecipeDetails {
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: string;
  yield?: string;
}

export interface RecipeStep {
  step: number;
  instruction: string;
  image: string;
}

export interface RecipeNutrition {
  calories: string;
  fat?: string;
  totalFat?: string;
  carbs?: string;
  protein?: string;
}

export interface Recipe {
  title: string;
  details: RecipeDetails;
  ingredients: Record<string, string[]>;
  steps: RecipeStep[];
  nutrition: RecipeNutrition;
}

export interface ApiResponse {
  success: boolean;
  data?: Recipe;
  error?: string;
}
