import { useState, useCallback } from 'react';
import { Participant } from '../types';

export const useParticipants = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);

  const addParticipant = useCallback((participant: Omit<Participant, 'id'>) => {
    const newParticipant: Participant = {
      ...participant,
      id: Date.now().toString(),
      importance: participant.importance || 'medium'
    };
    setParticipants(prev => [...prev, newParticipant]);
  }, []);

  const removeParticipant = useCallback((id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  }, []);

  const updateParticipant = useCallback((id: string, updates: Partial<Participant>) => {
    setParticipants(prev => 
      prev.map(p => p.id === id ? { ...p, ...updates } : p)
    );
  }, []);

  const clearParticipants = useCallback(() => {
    setParticipants([]);
  }, []);

  return {
    participants,
    addParticipant,
    removeParticipant,
    updateParticipant,
    clearParticipants
  };
};