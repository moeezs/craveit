'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateAllRecipesUrl } from '@/lib/recipe-api';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChefHat, Search, AlertCircle, Sparkles, Clock, Users } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState('');
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

    // Navigate to recipe page with URL as query parameter
    router.push(`/recipe?url=${encodeURIComponent(url)}`);
  };

  const exampleRecipes = [
    {
      title: "Brookies (Brownie Cookies)",
      url: "https://www.allrecipes.com/recipe/238654/brookies-brownie-cookies/",
      time: "40 mins",
      servings: "20"
    },
    {
      title: "Cheesy Chicken Broccoli Casserole", 
      url: "https://www.allrecipes.com/recipe/213742/cheesy-chicken-broccoli-casserole/",
      time: "45 mins",
      servings: "6"
    },
    {
      title: "Easy Meatloaf",
      url: "https://www.allrecipes.com/recipe/16354/easy-meatloaf/",
      time: "1 hr 15 mins",
      servings: "8"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
      <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="relative">
              <ChefHat className="w-16 h-16 text-orange-600" />
              <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-rose-600 bg-clip-text text-transparent">
              CraveIt
            </h1>
          </div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Transform any AllRecipes.com recipe into a beautiful, organized display with smart ingredient scaling.
            <br />
            <span className="text-lg text-slate-500">Just paste the link and let the magic begin ✨</span>
          </p>
        </div>

        {/* Main Input Section */}
        <Card className="max-w-2xl mx-auto mb-16 shadow-xl border-0 bg-white/70 backdrop-blur-sm">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Recipe URL
                </label>
                <div className="relative">
                  <Input
                    type="url"
                    placeholder="https://www.allrecipes.com/recipe/..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="pl-12 pr-4 py-6 text-lg border-2 border-slate-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>
              </div>
              
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}
              
              <Button 
                type="submit" 
                className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
                size="lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Transform Recipe
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Example Recipes */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">
            ✨ Try These Popular Recipes
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {exampleRecipes.map((recipe, index) => (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 border-0 bg-white/60 backdrop-blur-sm hover:bg-white/80"
                onClick={() => setUrl(recipe.url)}
              >
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-800 mb-3 leading-tight">
                    {recipe.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{recipe.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{recipe.servings}</span>
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-orange-600 font-medium">
                    Click to try →
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-slate-800">Beautiful Design</h3>
              <p className="text-sm text-slate-600">Clean, modern interface that makes cooking a joy</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-800">Smart Scaling</h3>
              <p className="text-sm text-slate-600">Automatically adjust ingredients for any number of servings</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-800">Instant Results</h3>
              <p className="text-sm text-slate-600">Get organized recipes in seconds, not minutes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
