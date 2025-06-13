'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Timer, Plus, Clock } from 'lucide-react';
import { KitchenTimer } from './kitchen-timer';

interface FloatingTimerManagerProps {
  activeTimers: number;
  completedTimers: number;
}

export function FloatingTimerManager({ activeTimers, completedTimers }: FloatingTimerManagerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            size="lg"
            className="rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            <div className="flex flex-col items-center">
              <Timer className="w-6 h-6" />
              {(activeTimers > 0 || completedTimers > 0) && (
                <div className="flex gap-1 mt-1">
                  {activeTimers > 0 && (
                    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                  )}
                  {completedTimers > 0 && (
                    <div className="w-2 h-2 bg-red-300 rounded-full animate-bounce" />
                  )}
                </div>
              )}
            </div>
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Kitchen Timer Manager
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <KitchenTimer showSuggestedOnly={false} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
