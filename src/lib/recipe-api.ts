import { Recipe } from '@/types/recipe';

export async function fetchRecipe(url: string): Promise<Recipe> {
  try {
    if (!url.includes('allrecipes.com')) {
      throw new Error('Please provide a valid AllRecipes.com URL');
    }

    const response = await fetch(`/api/recipe?url=${encodeURIComponent(url)}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `Failed to fetch recipe: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error('Fetch recipe error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while fetching the recipe');
  }
}

export function validateAllRecipesUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('allrecipes.com');
  } catch {
    return false;
  }
}
