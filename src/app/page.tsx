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
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <div className="flex justify-center gap-4 mt-6">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </CardHeader>
      </Card>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <ChefHat className="w-12 h-12 text-orange-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              CraveIt
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform any AllRecipes.com URL into a beautiful, organized recipe display. 
            Just paste the link and let us do the magic!
          </p>
        </div>

        {/* URL Input Form */}
        <Card className="max-w-2xl mx-auto mb-12">
          <CardHeader>
            <CardTitle className="text-center">Enter Recipe URL</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  type="url"
                  placeholder="https://www.allrecipes.com/recipe/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pr-12"
                  disabled={loading}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
                size="lg"
              >
                {loading ? 'Fetching Recipe...' : 'Get Recipe'}
              </Button>
            </form>
            
            <div className="mt-4 text-sm text-muted-foreground text-center">
              <p>💡 Tip: Copy any recipe URL from AllRecipes.com and paste it above</p>
            </div>
          </CardContent>
        </Card>

        {/* Recipe Display */}
        {loading && <LoadingSkeleton />}
        {recipe && !loading && <RecipeDisplay recipe={recipe} />}
        
        {/* Example URL for testing */}
        {!recipe && !loading && (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="text-center text-sm text-muted-foreground">
                <p className="mb-2">📝 Try this example:</p>
                <button
                  onClick={() => setUrl('https://www.allrecipes.com/recipe/238654/brookies-brownie-cookies/')}
                  className="text-blue-600 hover:text-blue-800 underline break-all"
                >
                  https://www.allrecipes.com/recipe/238654/brookies-brownie-cookies/
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
