'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Recipe } from '@/types/recipe';
import { fetchRecipe } from '@/lib/recipe-api';
import { RecipeDisplay } from '@/components/recipe-display';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function RecipePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get('url');
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      router.push('/');
      return;
    }

    const loadRecipe = async () => {
      setLoading(true);
      setError(null);

      try {
        const recipeData = await fetchRecipe(url);
        setRecipe(recipeData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch recipe');
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [url, router]);

  const LoadingSkeleton = () => (
    <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <div className="flex justify-center gap-6">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="flex justify-center gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <Skeleton className="h-8 w-32" />
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
        
        <div className="space-y-8">
          <Skeleton className="h-8 w-32" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/')}
              className="mb-6 hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="container mx-auto px-6 py-8">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/')}
            className="mb-6 hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
          
          <div className="max-w-2xl mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-base">{error}</AlertDescription>
            </Alert>
            <div className="text-center mt-6">
              <Button onClick={() => router.push('/')}>
                Try Another Recipe
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="container mx-auto px-6 py-8">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/')}
          className="mb-8 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>
        
        <RecipeDisplay recipe={recipe} />
      </div>
    </div>
  );
}
