import { format, addMinutes } from 'date-fns';
import { zonedTimeToUtc, toZonedTime, formatInTimeZone } from 'date-fns-tz';
import { Participant, SuitabilityScore, OptimalTimeSlot } from '../types';

export const getCurrentTimeInZone = (timeZone: string): string => {
  const now = new Date();
  return formatInTimeZone(now, timeZone, 'HH:mm');
};

export const getDateTimeInZone = (dateTime: Date, timeZone: string): string => {
  return formatInTimeZone(dateTime, timeZone, 'MMM dd, yyyy HH:mm');
};

export const getTimeInZone = (dateTime: Date, timeZone: string): string => {
  return formatInTimeZone(dateTime, timeZone, 'HH:mm');
};

export const calculateSuitability = (
  dateTime: Date,
  participant: Participant
): SuitabilityScore => {
  const localTime = toZonedTime(dateTime, participant.timeZone);
  const hour = localTime.getHours();
  const timeString = format(localTime, 'HH:mm');
  
  let score = 0;
  let level: 'poor' | 'acceptable' | 'optimal' = 'poor';
  let reasoning = '';

  // Weekend check
  const dayOfWeek = localTime.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  if (isWeekend) {
    score = Math.max(0, score - 20);
    reasoning += 'Weekend. ';
  }

  // Business hours scoring
  if (hour >= 9 && hour < 18) {
    score = 100;
    level = 'optimal';
    reasoning += 'Perfect business hours.';
  } else if ((hour >= 7 && hour < 9) || (hour >= 18 && hour < 21)) {
    score = 70;
    level = 'acceptable';
    reasoning += 'Acceptable extended hours.';
  } else if (hour >= 21 || hour < 7) {
    score = 30;
    level = 'poor';
    reasoning += 'Outside normal working hours.';
  }

  // Very early or very late penalty
  if (hour < 6 || hour > 23) {
    score = Math.max(0, score - 40);
    level = 'poor';
    reasoning = 'Very inconvenient time.';
  }

  return {
    score,
    level,
    localTime: timeString,
    reasoning: reasoning.trim()
  };
};

export const findOptimalTimes = (
  participants: Participant[],
  dateRange: { start: Date; end: Date },
  duration: number = 60
): OptimalTimeSlot[] => {
  const slots: OptimalTimeSlot[] = [];
  const startDate = new Date(dateRange.start);
  const endDate = new Date(dateRange.end);
  
  // Generate time slots every 30 minutes during business hours
  let currentDateTime = new Date(startDate);
  currentDateTime.setHours(8, 0, 0, 0); // Start at 8 AM

  while (currentDateTime <= endDate) {
    // Skip weekends
    const dayOfWeek = currentDateTime.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const hour = currentDateTime.getHours();
      
      // Only consider reasonable hours (8 AM to 8 PM in organizer's timezone)
      if (hour >= 8 && hour <= 20) {
        const suitabilityScores = participants.map(participant =>
          calculateSuitability(currentDateTime, participant)
        );

        const averageScore = suitabilityScores.reduce((sum, score) => sum + score.score, 0) / suitabilityScores.length;
        const suitableCount = suitabilityScores.filter(score => score.level !== 'poor').length;
        
        let reasoning = '';
        if (suitableCount === participants.length) {
          reasoning = `Perfect for all ${participants.length} participants`;
        } else if (suitableCount >= participants.length * 0.8) {
          reasoning = `Good for ${suitableCount}/${participants.length} participants`;
        } else {
          reasoning = `Only suitable for ${suitableCount}/${participants.length} participants`;
        }

        slots.push({
          dateTime: new Date(currentDateTime),
          score: averageScore,
          reasoning,
          suitableParticipants: suitableCount,
          totalParticipants: participants.length
        });
      }
    }

    // Move to next 30-minute slot
    currentDateTime = addMinutes(currentDateTime, 30);
    
    // If we've reached end of day, move to next day
    if (currentDateTime.getHours() > 20) {
      currentDateTime.setDate(currentDateTime.getDate() + 1);
      currentDateTime.setHours(8, 0, 0, 0);
    }
  }

  // Sort by score and return top 10
  return slots
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

export const getUserTimeZone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};