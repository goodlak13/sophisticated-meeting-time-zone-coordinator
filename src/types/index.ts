export interface Participant {
  id: string;
  name: string;
  location: string;
  timeZone: string;
  importance?: 'low' | 'medium' | 'high';
  flag?: string;
}

export interface MeetingProposal {
  id: string;
  dateTime: Date;
  duration: number; // in minutes
  title?: string;
  suitabilityScores: { [participantId: string]: SuitabilityScore };
}

export interface SuitabilityScore {
  score: number; // 0-100
  level: 'poor' | 'acceptable' | 'optimal';
  localTime: string;
  reasoning: string;
}

export interface TimeZoneData {
  name: string;
  offset: string;
  cities: string[];
  flag: string;
}

export interface OptimalTimeSlot {
  dateTime: Date;
  score: number;
  reasoning: string;
  suitableParticipants: number;
  totalParticipants: number;
}