'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Recipe } from '@/types/recipe';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Clock, Users, ChefHat, Flame, Minus, Plus, Calculator, ChevronLeft, ChevronRight, List, PlayCircle, Volume2, VolumeX } from 'lucide-react';
import { KitchenTimer } from '@/components/kitchen-timer';
import { detectTimingInText } from '@/lib/time-detection';
import { ShoppingListDialog } from '@/components/shopping-list-dialog';

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
  const [stepMode, setStepMode] = useState<'all' | 'step-by-step'>('all');
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  
  const scale = currentServings / originalServings;

  // Check speech synthesis support
  useEffect(() => {
    setSpeechSupported('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window);
  }, []);

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

  const nextStep = () => {
    if (currentStep < recipe.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  // Text-to-Speech functionality
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for cooking instructions
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const speakCurrentStep = useCallback(() => {
    const step = recipe.steps[currentStep];
    const text = `Step ${step.step}. ${step.instruction}`;
    speak(text);
  }, [recipe.steps, currentStep, speak]);

  const enterStepByStepMode = () => {
    setStepMode('step-by-step');
    setCurrentStep(0);
    // Welcome message when entering step-by-step mode
    setTimeout(() => {
      if (isAutoPlay) {
        speak(`Welcome to step-by-step cooking mode for ${recipe.title}. Lets start with step 1.`);
      }
    }, 500);
  };

  // Auto-play when step changes in step-by-step mode
  useEffect(() => {
    if (stepMode === 'step-by-step' && isAutoPlay && recipe.steps[currentStep]) {
      // Small delay to let the UI update
      const timer = setTimeout(() => {
        speakCurrentStep();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [currentStep, stepMode, isAutoPlay, recipe.steps, speakCurrentStep]);

  // Clean up speech when component unmounts
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Recipe Header */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
          {recipe.title}
        </h1>
        
        {/* Recipe Meta Info */}
        <div className="flex flex-wrap justify-center gap-6 text-muted-foreground">
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
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            {/* Shopping List Button */}
            <div className="flex justify-end mb-4">
              <ShoppingListDialog ingredients={scaledIngredients} />
            </div>
            {/* Serving Size Controller */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Calculator className="w-6 h-6 text-orange-600" />
                Ingredients
              </h2>
              
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Servings:</span>
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
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="font-bold text-lg text-foreground">{currentServings}</span>
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
              <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/30 rounded-lg">
                <p className="text-sm text-orange-800 dark:text-orange-200 text-center font-medium">
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
                      <h3 className="font-bold text-lg text-foreground mb-3">
                        {section}
                      </h3>
                      <Separator className="mb-4" />
                    </>
                  )}
                  <ul className="space-y-3">
                    {items.map((ingredient, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3 group">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0 group-hover:bg-orange-600 transition-colors" />
                        <span className="text-foreground leading-relaxed font-medium">
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
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <ChefHat className="w-6 h-6 text-orange-600" />
                Instructions
              </h2>
              
              {/* Mode Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={stepMode === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setStepMode('all');
                    stopSpeaking();
                  }}
                  className="flex items-center gap-2"
                >
                  <List className="w-4 h-4" />
                  All Steps
                </Button>
                <Button
                  variant={stepMode === 'step-by-step' ? 'default' : 'outline'}
                  size="sm"
                  onClick={enterStepByStepMode}
                  className="flex items-center gap-2"
                >
                  <PlayCircle className="w-4 h-4" />
                  Voice Guide
                </Button>
              </div>
            </div>

            {stepMode === 'all' ? (
              // All Steps View (Original)
              <div className="space-y-8">
                {recipe.steps.map((step, index) => (
                  <div key={step.step} className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                        {step.step}
                      </div>
                      <div className="flex-1 space-y-3">
                        <p className="text-foreground leading-relaxed pt-2 font-medium text-lg">
                          {step.instruction}
                        </p>
                        
                        {/* Show suggested timer only if timing is detected */}
                        {detectTimingInText(step.instruction) && (
                          <div className="ml-2">
                            <KitchenTimer 
                              stepNumber={step.step}
                              suggestedTime={detectTimingInText(step.instruction)?.totalSeconds}
                              showSuggestedOnly={true}
                            />
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speak(`Step ${step.step}. ${step.instruction}`)}
                        className="flex-shrink-0 mt-1 hover:bg-accent"
                        disabled={isSpeaking}
                      >
                        <Volume2 className="w-4 h-4 text-orange-600" />
                      </Button>
                    </div>
                    
                    {step.image && (
                      <div className="ml-14">
                        <Image
                          src={step.image}
                          alt={`Step ${step.step}`}
                          width={400}
                          height={300}
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
            ) : (
              // Step-by-Step View (New)
              <div className="space-y-6">
                {/* Voice Controls */}
                {speechSupported ? (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800/30 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Volume2 className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-800 dark:text-blue-200">Voice Assistant</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsAutoPlay(!isAutoPlay)}
                          className={`text-xs ${isAutoPlay ? 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30' : 'text-muted-foreground'}`}
                        >
                          {isAutoPlay ? 'Auto-play ON' : 'Auto-play OFF'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={isSpeaking ? stopSpeaking : speakCurrentStep}
                          className="text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                        >
                          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    {isSpeaking && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-blue-600 dark:text-blue-400">Speaking...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800/30 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <VolumeX className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm text-yellow-800 dark:text-yellow-200">
                        Voice features are not supported in your browser. Try Chrome, Safari, or Edge for the best experience.
                      </span>
                    </div>
                  </div>
                )}

                {/* Progress Indicator */}
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Step {currentStep + 1} of {recipe.steps.length}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(((currentStep + 1) / recipe.steps.length) * 100)}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentStep + 1) / recipe.steps.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Current Step */}
                <div className="bg-gradient-to-br from-card to-muted/30 border-2 border-orange-200 dark:border-orange-800/30 rounded-2xl p-8">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg">
                      {recipe.steps[currentStep].step}
                    </div>
                    <div className="flex-1 space-y-4">
                      <p className="text-foreground leading-relaxed text-xl font-medium">
                        {recipe.steps[currentStep].instruction}
                      </p>
                      
                      {/* Timer for current step - only if timing detected */}
                      {detectTimingInText(recipe.steps[currentStep].instruction) && (
                        <div className="bg-muted/50 border border-border rounded-lg p-4">
                          <KitchenTimer 
                            stepNumber={recipe.steps[currentStep].step}
                            suggestedTime={detectTimingInText(recipe.steps[currentStep].instruction)?.totalSeconds}
                            showSuggestedOnly={true}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {recipe.steps[currentStep].image && (
                    <div className="flex justify-center mt-6">
                      <Image
                        src={recipe.steps[currentStep].image}
                        alt={`Step ${recipe.steps[currentStep].step}`}
                        width={500}
                        height={320}
                        className="rounded-xl max-w-full max-h-80 object-cover shadow-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  {/* Step Dots */}
                  <div className="flex items-center gap-2">
                    {recipe.steps.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToStep(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          index === currentStep 
                            ? 'bg-orange-500 scale-125' 
                            : index < currentStep 
                              ? 'bg-green-400' 
                              : 'bg-slate-300'
                        }`}
                      />
                    ))}
                  </div>

                  <Button
                    variant={currentStep === recipe.steps.length - 1 ? "default" : "outline"}
                    onClick={nextStep}
                    disabled={currentStep === recipe.steps.length - 1}
                    className="flex items-center gap-2"
                  >
                    {currentStep === recipe.steps.length - 1 ? 'Complete!' : 'Next'}
                    {currentStep < recipe.steps.length - 1 && <ChevronRight className="w-4 h-4" />}
                  </Button>
                </div>

                {/* Completion Message */}
                {currentStep === recipe.steps.length - 1 && (
                  <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30 rounded-xl p-6 text-center">
                    <div className="text-2xl mb-2">🎉</div>
                    <h3 className="font-bold text-green-800 dark:text-green-200 mb-2">Congratulations!</h3>
                    <p className="text-green-700 dark:text-green-300">You&apos;ve completed all the steps. Enjoy your {recipe.title}!</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
