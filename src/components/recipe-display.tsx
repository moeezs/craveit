'use client';

import { Recipe } from '@/types/recipe';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Users, ChefHat, Flame, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface RecipeDisplayProps {
  recipe: Recipe;
}

export function RecipeDisplay({ recipe }: RecipeDisplayProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (stepNumber: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepNumber)) {
      newCompleted.delete(stepNumber);
    } else {
      newCompleted.add(stepNumber);
    }
    setCompletedSteps(newCompleted);
  };

  return (
    <div className="space-y-8">
      {/* Recipe Header */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-8 lg:p-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {recipe.title}
            </h1>
            
            {/* Recipe Meta Info */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 max-w-2xl mx-auto">
              {recipe.details.prepTime && (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-2xl mb-3">
                    <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Prep Time</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{recipe.details.prepTime}</p>
                </div>
              )}
              
              {recipe.details.cookTime && (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-2xl mb-3">
                    <ChefHat className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Cook Time</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{recipe.details.cookTime}</p>
                </div>
              )}
              
              {recipe.details.totalTime && (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-2xl mb-3">
                    <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Time</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{recipe.details.totalTime}</p>
                </div>
              )}
              
              {recipe.details.servings && (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-2xl mb-3">
                    <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Servings</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{recipe.details.servings}</p>
                </div>
              )}
            </div>

            {/* Nutrition Info */}
            {recipe.nutrition && (
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {recipe.nutrition.calories && (
                  <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800 px-4 py-2 text-sm">
                    <Flame className="w-4 h-4 mr-2" />
                    {recipe.nutrition.calories} cal
                  </Badge>
                )}
                {recipe.nutrition.fat && (
                  <Badge variant="outline" className="px-4 py-2 text-sm">Fat: {recipe.nutrition.fat}</Badge>
                )}
                {recipe.nutrition.totalFat && (
                  <Badge variant="outline" className="px-4 py-2 text-sm">Fat: {recipe.nutrition.totalFat}</Badge>
                )}
                {recipe.nutrition.carbs && (
                  <Badge variant="outline" className="px-4 py-2 text-sm">Carbs: {recipe.nutrition.carbs}</Badge>
                )}
                {recipe.nutrition.protein && (
                  <Badge variant="outline" className="px-4 py-2 text-sm">Protein: {recipe.nutrition.protein}</Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Ingredients */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8 sticky top-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              Ingredients
            </h2>
            
            <div className="space-y-6">
              {Object.entries(recipe.ingredients).map(([section, items], index) => (
                <div key={index}>
                  {Object.keys(recipe.ingredients).length > 1 && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">
                        {section}
                      </h3>
                      <Separator className="mb-4" />
                    </div>
                  )}
                  <ul className="space-y-3">
                    {items.map((ingredient, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3 group">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0 group-hover:bg-orange-600 transition-colors" />
                        <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {ingredient}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              Instructions
            </h2>
            
            <div className="space-y-6">
              {recipe.steps.map((step) => {
                const isCompleted = completedSteps.has(step.step);
                return (
                  <div key={step.step} className="group">
                    <div 
                      className={`p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                        isCompleted 
                          ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={() => toggleStep(step.step)}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-200 ${
                          isCompleted 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.step}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`leading-relaxed transition-all duration-200 ${
                            isCompleted 
                              ? 'text-gray-600 dark:text-gray-400 line-through' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {step.instruction}
                          </p>
                        </div>
                      </div>
                      
                      {step.image && (
                        <div className="mt-4 ml-14">
                          <img
                            src={step.image}
                            alt={`Step ${step.step}`}
                            className="rounded-xl w-full max-w-md object-cover shadow-md"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Completion Progress */}
            {completedSteps.size > 0 && (
              <div className="mt-8 p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <span className="text-green-800 dark:text-green-400 font-medium">
                    Progress: {completedSteps.size} of {recipe.steps.length} steps completed
                  </span>
                  <div className="text-green-600 dark:text-green-400">
                    {Math.round((completedSteps.size / recipe.steps.length) * 100)}%
                  </div>
                </div>
                <div className="mt-2 w-full bg-green-200 dark:bg-green-900/30 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(completedSteps.size / recipe.steps.length) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
