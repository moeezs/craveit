'use client';

import { Recipe } from '@/types/recipe';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Users, ChefHat, Flame } from 'lucide-react';

interface RecipeDisplayProps {
  recipe: Recipe;
}

export function RecipeDisplay({ recipe }: RecipeDisplayProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Recipe Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            {recipe.title}
          </CardTitle>
          
          {/* Recipe Details */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {recipe.details.prepTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Prep:</strong> {recipe.details.prepTime}
                </span>
              </div>
            )}
            
            {recipe.details.cookTime && (
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Cook:</strong> {recipe.details.cookTime}
                </span>
              </div>
            )}
            
            {recipe.details.totalTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Total:</strong> {recipe.details.totalTime}
                </span>
              </div>
            )}
            
            {recipe.details.servings && (
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Servings:</strong> {recipe.details.servings}
                </span>
              </div>
            )}
          </div>

          {/* Nutrition Info */}
          {recipe.nutrition && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {recipe.nutrition.calories && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  {recipe.nutrition.calories} cal
                </Badge>
              )}
              {recipe.nutrition.fat && (
                <Badge variant="outline">Fat: {recipe.nutrition.fat}</Badge>
              )}
              {recipe.nutrition.totalFat && (
                <Badge variant="outline">Fat: {recipe.nutrition.totalFat}</Badge>
              )}
              {recipe.nutrition.carbs && (
                <Badge variant="outline">Carbs: {recipe.nutrition.carbs}</Badge>
              )}
              {recipe.nutrition.protein && (
                <Badge variant="outline">Protein: {recipe.nutrition.protein}</Badge>
              )}
            </div>
          )}
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Ingredients */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Ingredients</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(recipe.ingredients).map(([section, items], index) => (
              <div key={index}>
                {Object.keys(recipe.ingredients).length > 1 && (
                  <>
                    <h3 className="font-semibold text-lg text-primary mb-2">
                      {section}
                    </h3>
                    <Separator className="mb-3" />
                  </>
                )}
                <ul className="space-y-2">
                  {items.map((ingredient, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{ingredient}</span>
                    </li>
                  ))}
                </ul>
                {index < Object.entries(recipe.ingredients).length - 1 && (
                  <div className="mt-4" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {recipe.steps.map((step) => (
              <div key={step.step} className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="default" className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
                    {step.step}
                  </Badge>
                  <p className="text-sm leading-relaxed flex-1 pt-1">
                    {step.instruction}
                  </p>
                </div>
                
                {step.image && (
                  <div className="ml-11">
                    <img
                      src={step.image}
                      alt={`Step ${step.step}`}
                      className="rounded-lg w-full max-w-sm object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                {step.step < recipe.steps.length && (
                  <Separator className="ml-11" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
