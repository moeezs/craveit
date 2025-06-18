'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  X, 
  Bell,
  Clock,
  Plus
} from 'lucide-react';

export interface TimerData {
  id: string;
  name: string;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  isCompleted: boolean;
}

interface KitchenTimerProps {
  stepNumber?: number;
  suggestedTime?: number; // in seconds
  showSuggestedOnly?: boolean; // Only show if there's a suggested time
}

export function KitchenTimer({ stepNumber, suggestedTime, showSuggestedOnly = false }: KitchenTimerProps) {
  const [timers, setTimers] = useState<TimerData[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTimerMinutes, setNewTimerMinutes] = useState(suggestedTime ? Math.floor(suggestedTime / 60) : 10);
  const [newTimerSeconds, setNewTimerSeconds] = useState(suggestedTime ? suggestedTime % 60 : 0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<{ play: () => void } | null>(null);

  // Create audio context for timer completion sound
  useEffect(() => {
    // Create a simple beep sound programmatically
    const createBeepSound = () => {
      try {
        const audioContext = new ((window as Window & typeof globalThis).AudioContext || (window as Window & typeof globalThis & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      } catch (error) {
        console.log('Audio not supported:', error);
      }
    };
    
    audioRef.current = { play: createBeepSound };
  }, []);

  // Main timer interval
  useEffect(() => {
    if (timers.some(timer => timer.isRunning)) {
      intervalRef.current = setInterval(() => {
        setTimers(prev => prev.map(timer => {
          if (!timer.isRunning || timer.remainingSeconds <= 0) return timer;
          
          const newRemaining = timer.remainingSeconds - 1;
          
          if (newRemaining <= 0) {
            // Timer completed - play sound
            if (audioRef.current?.play) {
              audioRef.current.play();
            }
            
            // Browser notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(`Timer Complete!`, {
                body: timer.name,
                icon: '/favicon.ico'
              });
            }
            
            return {
              ...timer,
              remainingSeconds: 0,
              isRunning: false,
              isCompleted: true
            };
          }
          
          return {
            ...timer,
            remainingSeconds: newRemaining
          };
        }));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timers]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const createTimer = () => {
    const totalSeconds = newTimerMinutes * 60 + newTimerSeconds;
    if (totalSeconds <= 0) return;

    const newTimer: TimerData = {
      id: Date.now().toString(),
      name: stepNumber ? `Step ${stepNumber} Timer` : `Timer ${timers.length + 1}`,
      totalSeconds,
      remainingSeconds: totalSeconds,
      isRunning: false,
      isCompleted: false
    };

    setTimers(prev => [...prev, newTimer]);
    setIsDialogOpen(false);
  };

  const startTimer = (id: string) => {
    setTimers(prev => prev.map(timer => 
      timer.id === id 
        ? { ...timer, isRunning: true, isCompleted: false }
        : timer
    ));
  };

  const pauseTimer = (id: string) => {
    setTimers(prev => prev.map(timer => 
      timer.id === id 
        ? { ...timer, isRunning: false }
        : timer
    ));
  };

  const resetTimer = (id: string) => {
    setTimers(prev => prev.map(timer => 
      timer.id === id 
        ? { 
            ...timer, 
            remainingSeconds: timer.totalSeconds, 
            isRunning: false, 
            isCompleted: false 
          }
        : timer
    ));
  };

  const deleteTimer = (id: string) => {
    setTimers(prev => prev.filter(timer => timer.id !== id));
  };

  const hasActiveTimers = timers.length > 0;
  const runningTimers = timers.filter(t => t.isRunning).length;
  const completedTimers = timers.filter(t => t.isCompleted).length;

  return (
    <div className="space-y-4">
      {/* Timer Status Badge */}
      {hasActiveTimers && (
        <div className="flex items-center gap-2 mb-4">
          <Badge 
            variant={runningTimers > 0 ? "default" : "secondary"}
            className="flex items-center gap-1"
          >
            <Timer className="w-3 h-3" />
            {runningTimers} Running
          </Badge>
          {completedTimers > 0 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <Bell className="w-3 h-3" />
              {completedTimers} Complete
            </Badge>
          )}
        </div>
      )}

      {/* Active Timers List */}
      {timers.length > 0 && (
        <div className="space-y-3">
          {timers.map(timer => (
            <div 
              key={timer.id}
              className={`border rounded-lg p-4 ${
                timer.isCompleted 
                  ? 'bg-red-50 border-red-200' 
                  : timer.isRunning 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-slate-800">{timer.name}</h4>
                <div className="flex items-center gap-1">
                  {!timer.isCompleted && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => timer.isRunning ? pauseTimer(timer.id) : startTimer(timer.id)}
                        className="h-8 w-8 p-0"
                      >
                        {timer.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => resetTimer(timer.id)}
                        className="h-8 w-8 p-0"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTimer(timer.id)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-2xl font-mono font-bold ${
                    timer.isCompleted ? 'text-red-600' : 'text-slate-800'
                  }`}>
                    {formatTime(timer.remainingSeconds)}
                  </span>
                  {timer.isCompleted && (
                    <Badge variant="destructive" className="animate-pulse">
                      <Bell className="w-3 h-3 mr-1" />
                      Time&apos;s Up!
                    </Badge>
                  )}
                </div>
                
                <Progress 
                  value={((timer.totalSeconds - timer.remainingSeconds) / timer.totalSeconds) * 100}
                  className="h-2"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Timer Button */}
      {(suggestedTime || !showSuggestedOnly) && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant={suggestedTime ? "default" : "outline"} 
              size="sm"
              className="flex items-center gap-2"
            >
              <Timer className="w-4 h-4" />
              {suggestedTime ? 'Start Suggested Timer' : 'Add Timer'}
              {suggestedTime && (
                <Badge variant="secondary" className="ml-1">
                  {formatTime(suggestedTime)}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
        
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Create Kitchen Timer
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={newTimerMinutes}
                  onChange={(e) => setNewTimerMinutes(Number(e.target.value))}
                  className="w-20 px-3 py-2 border border-slate-300 rounded-md text-center"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Seconds</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={newTimerSeconds}
                  onChange={(e) => setNewTimerSeconds(Number(e.target.value))}
                  className="w-20 px-3 py-2 border border-slate-300 rounded-md text-center"
                />
              </div>
            </div>

            {suggestedTime && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  💡 <strong>Suggested:</strong> This step mentions timing. 
                  Default set to {formatTime(suggestedTime)}.
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={createTimer} className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Create Timer
              </Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
