import React from 'react';
import { MeetingProposal, Participant } from '../types';
import { format } from 'date-fns';
import { getTimeInZone, formatDuration } from '../utils/timeZoneUtils';
import { Clock, Calendar, X, Users } from 'lucide-react';
import GlassCard from './GlassCard';

interface ProposalCardProps {
  proposal: MeetingProposal;
  participants: Participant[];
  onRemove: (id: string) => void;
}

const ProposalCard: React.FC<ProposalCardProps> = ({ proposal, participants, onRemove }) => {
  const suitabilityLevels = {
    optimal: { color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' },
    acceptable: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' },
    poor: { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' }
  };

  const optimalCount = participants.filter(p => 
    proposal.suitabilityScores[p.id]?.level === 'optimal'
  ).length;

  const acceptableCount = participants.filter(p => 
    proposal.suitabilityScores[p.id]?.level === 'acceptable'
  ).length;

  const overallScore = Math.round(
    participants.reduce((sum, p) => sum + (proposal.suitabilityScores[p.id]?.score || 0), 0) / participants.length
  );

  return (
    <GlassCard className="p-6 relative group">
      <button
        onClick={() => onRemove(proposal.id)}
        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500/10 rounded-full"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="mb-4">
        {proposal.title && (
          <h3 className="text-lg font-semibold text-white mb-2">{proposal.title}</h3>
        )}
        
        <div className="flex items-center gap-4 text-slate-300">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{format(proposal.dateTime, 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{format(proposal.dateTime, 'HH:mm')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{formatDuration(proposal.duration)}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-sm text-slate-400">Overall Score:</span>
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              overallScore >= 80 ? 'bg-green-500/20 text-green-400' :
              overallScore >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {overallScore}%
            </div>
            <span className="text-xs text-slate-400">
              {optimalCount}👍 {acceptableCount}👌 {participants.length - optimalCount - acceptableCount}👎
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {participants.map(participant => {
          const score = proposal.suitabilityScores[participant.id];
          if (!score) return null;

          const localTime = getTimeInZone(proposal.dateTime, participant.timeZone);
          const styles = suitabilityLevels[score.level];

          return (
            <div
              key={participant.id}
              className={`p-3 rounded-lg border ${styles.bg} ${styles.border}`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{participant.flag}</span>
                  <span className="text-white font-medium">{participant.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-white">{localTime}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${styles.color} bg-white/10`}>
                    {score.score}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400">{score.reasoning}</p>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};

export default ProposalCard;