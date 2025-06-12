'use client';

import { useState, useMemo } from 'react';
import { Recipe } from '@/types/recipe';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Clock, Users, ChefHat, Flame, Minus, Plus, Calculator } from 'lucide-react';

interface RecipeDisplayProps {
  recipe: Recipe;
}

// Helper function to parse and scale ingredient quantities
function scaleIngredient(ingredient: string, scale: number): string {
  // Common fraction mappings
  const fractionMap: { [key: string]: number } = {
    '1/8': 0.125, '1/4': 0.25, '1/3': 0.333, '1/2': 0.5, '2/3': 0.667, '3/4': 0.75
  };
  
  // Reverse fraction mapping for display
  const reverseMap: { [key: number]: string } = {
    0.125: '1/8', 0.25: '1/4', 0.333: '1/3', 0.5: '1/2', 0.667: '2/3', 0.75: '3/4'
  };

  // Find numbers and fractions in the ingredient
  const regex = /(\d+\.?\d*)\s*([\/]\s*\d+\.?\d*)?|\b(1\/8|1\/4|1\/3|1\/2|2\/3|3\/4)\b/g;
  
  return ingredient.replace(regex, (match) => {
    let number = 0;
    
    // Check if it's a common fraction
    if (fractionMap[match.trim()]) {
      number = fractionMap[match.trim()];
    } else {
      // Parse regular numbers and fractions
      if (match.includes('/')) {
        const parts = match.split('/');
        number = parseFloat(parts[0]) / parseFloat(parts[1]);
      } else {
        number = parseFloat(match);
      }
    }
    
    const scaled = number * scale;
    
    // Round to reasonable precision
    const rounded = Math.round(scaled * 8) / 8; // Round to nearest 1/8
    
    // Check if we can represent as a simple fraction
    for (const [decimal, fraction] of Object.entries(reverseMap)) {
      if (Math.abs(rounded - parseFloat(decimal)) < 0.01) {
        return fraction;
      }
    }
    
    // Format the number nicely
    if (rounded % 1 === 0) {
      return rounded.toString();
    } else if (rounded < 0.1) {
      return '1/8'; // Minimum amount
    } else {
      return rounded.toFixed(2).replace(/\.?0+$/, '');
    }
  });
}

export function RecipeDisplay({ recipe }: RecipeDisplayProps) {
  const originalServings = parseInt(recipe.details.servings) || 1;
  const [currentServings, setCurrentServings] = useState(originalServings);
  
  const scale = currentServings / originalServings;

  // Scale ingredients based on serving size
  const scaledIngredients = useMemo(() => {
    const scaled: Record<string, string[]> = {};
    
    Object.entries(recipe.ingredients).forEach(([section, items]) => {
      scaled[section] = items.map(ingredient => scaleIngredient(ingredient, scale));
    });
    
    return scaled;
  }, [recipe.ingredients, scale]);

  const adjustServings = (increment: number) => {
    const newServings = Math.max(1, currentServings + increment);
    setCurrentServings(newServings);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Recipe Header */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 leading-tight">
          {recipe.title}
        </h1>
        
        {/* Recipe Meta Info */}
        <div className="flex flex-wrap justify-center gap-6 text-slate-600">
          {recipe.details.prepTime && (
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Prep: {recipe.details.prepTime}</span>
            </div>
          )}
          
          {recipe.details.cookTime && (
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5" />
              <span className="font-medium">Cook: {recipe.details.cookTime}</span>
            </div>
          )}
          
          {recipe.details.totalTime && (
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Total: {recipe.details.totalTime}</span>
            </div>
          )}
        </div>

        {/* Nutrition Badges */}
        {recipe.nutrition && (
          <div className="flex flex-wrap justify-center gap-3">
            {recipe.nutrition.calories && (
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                <Flame className="w-4 h-4 mr-1 text-orange-500" />
                {recipe.nutrition.calories} cal
              </Badge>
            )}
            {(recipe.nutrition.fat || recipe.nutrition.totalFat) && (
              <Badge variant="outline" className="px-3 py-1">
                Fat: {recipe.nutrition.fat || recipe.nutrition.totalFat}
              </Badge>
            )}
            {recipe.nutrition.carbs && (
              <Badge variant="outline" className="px-3 py-1">
                Carbs: {recipe.nutrition.carbs}
              </Badge>
            )}
            {recipe.nutrition.protein && (
              <Badge variant="outline" className="px-3 py-1">
                Protein: {recipe.nutrition.protein}
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Ingredients Section with Scaling */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            {/* Serving Size Controller */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Calculator className="w-6 h-6 text-orange-600" />
                Ingredients
              </h2>
              
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-600">Servings:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => adjustServings(-1)}
                    disabled={currentServings <= 1}
                    className="h-8 w-8 p-0 rounded-full"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  
                  <div className="flex items-center gap-2 min-w-[80px] justify-center">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span className="font-bold text-lg text-slate-800">{currentServings}</span>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => adjustServings(1)}
                    className="h-8 w-8 p-0 rounded-full"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {scale !== 1 && (
              <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800 text-center font-medium">
                  📊 Ingredients scaled {scale > 1 ? 'up' : 'down'} by {scale.toFixed(2)}x
                  {currentServings !== originalServings && (
                    <span className="block text-xs mt-1">
                      Original recipe served {originalServings}
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Ingredients List */}
            <div className="space-y-6">
              {Object.entries(scaledIngredients).map(([section, items], index) => (
                <div key={index}>
                  {Object.keys(scaledIngredients).length > 1 && (
                    <>
                      <h3 className="font-bold text-lg text-slate-700 mb-3">
                        {section}
                      </h3>
                      <Separator className="mb-4" />
                    </>
                  )}
                  <ul className="space-y-3">
                    {items.map((ingredient, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3 group">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0 group-hover:bg-orange-600 transition-colors" />
                        <span className="text-slate-700 leading-relaxed font-medium">
                          {ingredient}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {index < Object.entries(scaledIngredients).length - 1 && (
                    <Separator className="mt-6" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instructions Section */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-orange-600" />
              Instructions
            </h2>
            
            <div className="space-y-8">
              {recipe.steps.map((step, index) => (
                <div key={step.step} className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                      {step.step}
                    </div>
                    <p className="text-slate-700 leading-relaxed flex-1 pt-2 font-medium text-lg">
                      {step.instruction}
                    </p>
                  </div>
                  
                  {step.image && (
                    <div className="ml-14">
                      <img
                        src={step.image}
                        alt={`Step ${step.step}`}
                        className="rounded-xl w-full max-w-md object-cover shadow-md hover:shadow-lg transition-shadow"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  {index < recipe.steps.length - 1 && (
                    <Separator className="ml-14 mt-6" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
