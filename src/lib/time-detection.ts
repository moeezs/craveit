// Utility functions for detecting and parsing time from recipe instructions

export interface DetectedTime {
  minutes: number;
  seconds: number;
  totalSeconds: number;
  matchedText: string;
}

export function detectTimingInText(text: string): DetectedTime | null {
  // Common time patterns in cooking instructions
  const timePatterns = [
    // "15 minutes", "15 mins", "15 min"
    /(\d+)\s*(?:minutes?|mins?)/gi,
    // "2 hours", "2 hrs", "2 hr"
    /(\d+)\s*(?:hours?|hrs?)/gi,
    // "30 seconds", "30 secs", "30 sec"
    /(\d+)\s*(?:seconds?|secs?)/gi,
    // "1-2 minutes", "3-5 mins"
    /(\d+)[-–]\d+\s*(?:minutes?|mins?)/gi,
    // "for 10 minutes"
    /for\s+(\d+)\s*(?:minutes?|mins?)/gi,
    // "cook 20 minutes"
    /cook\s+(\d+)\s*(?:minutes?|mins?)/gi,
    // "bake 25 minutes"
    /bake\s+(\d+)\s*(?:minutes?|mins?)/gi,
    // "simmer 15 minutes"
    /simmer\s+(\d+)\s*(?:minutes?|mins?)/gi,
    // "rest 5 minutes"
    /rest\s+(\d+)\s*(?:minutes?|mins?)/gi,
    // "wait 10 minutes"
    /wait\s+(\d+)\s*(?:minutes?|mins?)/gi,
    // "until timer", "when timer"
    /(?:until|when)\s+timer/gi
  ];

  for (const pattern of timePatterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      const match = matches[0];
      const numberMatch = match.match(/\d+/);
      
      if (numberMatch) {
        const number = parseInt(numberMatch[0]);
        let totalSeconds = 0;
        
        // Determine if it's minutes, hours, or seconds
        if (match.toLowerCase().includes('hour') || match.toLowerCase().includes('hr')) {
          totalSeconds = number * 3600; // hours to seconds
        } else if (match.toLowerCase().includes('second') || match.toLowerCase().includes('sec')) {
          totalSeconds = number; // already seconds
        } else {
          totalSeconds = number * 60; // assume minutes
        }
        
        // Handle range (take the middle value)
        const rangeMatch = match.match(/(\d+)[-–](\d+)/);
        if (rangeMatch) {
          const min = parseInt(rangeMatch[1]);
          const max = parseInt(rangeMatch[2]);
          const avg = Math.round((min + max) / 2);
          totalSeconds = avg * 60; // assume minutes for ranges
        }
        
        // Cap at reasonable cooking times (max 4 hours)
        totalSeconds = Math.min(totalSeconds, 4 * 3600);
        
        return {
          minutes: Math.floor(totalSeconds / 60),
          seconds: totalSeconds % 60,
          totalSeconds,
          matchedText: match
        };
      }
    }
  }
  
  return null;
}

export function formatTimeDisplay(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
}

export function getTimingKeywords(): string[] {
  return [
    'bake', 'cook', 'simmer', 'boil', 'roast', 'grill', 'fry', 'sauté',
    'steam', 'broil', 'marinate', 'chill', 'freeze', 'rest', 'wait',
    'timer', 'until', 'for', 'about', 'approximately'
  ];
}
