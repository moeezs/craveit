'use client';

import { useState } from 'react';
import { Recipe } from '@/types/recipe';
import { fetchRecipe, validateAllRecipesUrl } from '@/lib/recipe-api';
import { RecipeDisplay } from '@/components/recipe-display';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ChefHat, Search, AlertCircle } from 'lucide-react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a recipe URL');
      return;
    }

    if (!validateAllRecipesUrl(url)) {
      setError('Please enter a valid AllRecipes.com URL');
      return;
    }

    setLoading(true);
    setError(null);
    setRecipe(null);

    try {
      const recipeData = await fetchRecipe(url);
      setRecipe(recipeData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recipe');
    } finally {
      setLoading(false);
    }
  };

  const LoadingSkeleton = () => (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
        <div className="text-center space-y-4">
          <Skeleton className="h-10 w-3/4 mx-auto" />
          <div className="flex justify-center gap-6">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="flex justify-center gap-2">
            <Skeleton className="h-7 w-16 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
            <Skeleton className="h-7 w-18 rounded-full" />
          </div>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Ingredients skeleton */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Instructions skeleton */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                  <Skeleton className="h-20 flex-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <div className="relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900" />
        
        {/* Content */}
        <div className="relative">
          <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-3xl mb-8">
                <ChefHat className="w-10 h-10 text-orange-600 dark:text-orange-400" />
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                CraveIt
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Transform any AllRecipes.com URL into a beautifully organized recipe.
                <br />
                <span className="text-gray-500 dark:text-gray-400 text-lg">
                  Just paste, fetch, and cook.
                </span>
              </p>
            </div>

            {/* URL Input Form */}
            <div className="max-w-2xl mx-auto mb-16">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <Input
                      type="url"
                      placeholder="Paste your AllRecipes.com URL here..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="h-14 text-lg pl-6 pr-14 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      disabled={loading}
                    />
                    <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                  </div>
                  
                  {error && (
                    <Alert variant="destructive" className="rounded-xl">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-base">{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg font-medium bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]" 
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Fetching Recipe...
                      </div>
                    ) : (
                      'Get Recipe'
                    )}
                  </Button>
                </form>
                
                {/* Example link */}
                {!recipe && !loading && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 text-center">
                      Try this example recipe:
                    </p>
                    <button
                      onClick={() => setUrl('https://www.allrecipes.com/recipe/238654/brookies-brownie-cookies/')}
                      className="w-full text-left p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <ChefHat className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                            Brookies (Brownie Cookies)
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            allrecipes.com/recipe/238654/brookies-brownie-cookies/
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Display Section */}
      {(loading || recipe) && (
        <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-6 py-16">
            {loading && <LoadingSkeleton />}
            {recipe && !loading && <RecipeDisplay recipe={recipe} />}
          </div>
        </div>
      )}
    </div>
  );
}
