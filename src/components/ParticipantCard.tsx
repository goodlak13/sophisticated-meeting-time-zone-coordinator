import React, { useState, useEffect } from 'react';
import { Participant } from '../types';
import { getCurrentTimeInZone } from '../utils/timeZoneUtils';
import { Clock, MapPin, X, Star } from 'lucide-react';
import GlassCard from './GlassCard';

interface ParticipantCardProps {
  participant: Participant;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Participant>) => void;
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({ participant, onRemove, onUpdate }) => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(getCurrentTimeInZone(participant.timeZone));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [participant.timeZone]);

  const importanceColors = {
    low: 'text-slate-400',
    medium: 'text-yellow-400',
    high: 'text-red-400'
  };

  return (
    <GlassCard className="p-6 relative group" hover>
      <button
        onClick={() => onRemove(participant.id)}
        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500/10 rounded-full"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-4 mb-4">
        <div className="text-3xl">{participant.flag}</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{participant.name}</h3>
          <div className="flex items-center gap-2 text-slate-300 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{participant.location}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          <span className="text-2xl font-mono text-white tabular-nums">
            {currentTime}
          </span>
        </div>
        
        <button
          onClick={() => {
            const importanceLevels: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
            const currentIndex = importanceLevels.indexOf(participant.importance || 'medium');
            const nextIndex = (currentIndex + 1) % importanceLevels.length;
            onUpdate(participant.id, { importance: importanceLevels[nextIndex] });
          }}
          className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <Star className={`w-4 h-4 ${importanceColors[participant.importance || 'medium']}`} />
          <span className="text-xs text-slate-400 capitalize">
            {participant.importance || 'medium'}
          </span>
        </button>
      </div>

      <div className="text-xs text-slate-400 font-mono">
        {participant.timeZone}
      </div>
    </GlassCard>
  );
};

export default ParticipantCard;