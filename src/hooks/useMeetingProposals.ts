import { useState, useCallback } from 'react';
import { MeetingProposal, Participant } from '../types';
import { calculateSuitability } from '../utils/timeZoneUtils';

export const useMeetingProposals = () => {
  const [proposals, setProposals] = useState<MeetingProposal[]>([]);

  const addProposal = useCallback((dateTime: Date, duration: number, participants: Participant[], title?: string) => {
    const suitabilityScores: { [participantId: string]: any } = {};
    
    participants.forEach(participant => {
      suitabilityScores[participant.id] = calculateSuitability(dateTime, participant);
    });

    const newProposal: MeetingProposal = {
      id: Date.now().toString(),
      dateTime,
      duration,
      title,
      suitabilityScores
    };

    setProposals(prev => [...prev, newProposal]);
  }, []);

  const removeProposal = useCallback((id: string) => {
    setProposals(prev => prev.filter(p => p.id !== id));
  }, []);

  const clearProposals = useCallback(() => {
    setProposals([]);
  }, []);

  return {
    proposals,
    addProposal,
    removeProposal,
    clearProposals
  };
};