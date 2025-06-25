import React, { useState, useEffect } from 'react';
import { Participant, OptimalTimeSlot } from '../types';
import { findOptimalTimes, formatDuration } from '../utils/timeZoneUtils';
import { format, addDays } from 'date-fns';
import { Brain, Calendar, Clock, TrendingUp, Zap } from 'lucide-react';
import GlassCard from './GlassCard';

interface SmartSuggestionsProps {
  participants: Participant[];
  onSelectTime: (dateTime: Date, duration: number) => void;
}

const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({ participants, onSelectTime }) => {
  const [suggestions, setSuggestions] = useState<OptimalTimeSlot[]>([]);
  const [duration, setDuration] = useState(60);
  const [isLoading, setIsLoading] = useState(false);

  const findSuggestions = async () => {
    if (participants.length < 2) return;

    setIsLoading(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    const dateRange = {
      start: new Date(),
      end: addDays(new Date(), 14) // Next 2 weeks
    };

    const optimalTimes = findOptimalTimes(participants, dateRange, duration);
    setSuggestions(optimalTimes);
    setIsLoading(false);
  };

  useEffect(() => {
    findSuggestions();
  }, [participants, duration]);

  if (participants.length < 2) {
    return (
      <GlassCard className="p-6">
        <div className="text-center py-8">
          <Brain className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-400">Add at least 2 participants to see smart suggestions</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg">
          <Brain className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Smart Suggestions</h2>
          <p className="text-slate-400 text-sm">AI-powered optimal meeting times</p>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Meeting Duration
        </label>
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
        >
          <option value={30}>30 minutes</option>
          <option value={60}>1 hour</option>
          <option value={90}>1.5 hours</option>
          <option value={120}>2 hours</option>
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-white/5 rounded-lg"></div>
            </div>
          ))}
          <div className="text-center text-cyan-400 mt-4">
            <Zap className="w-6 h-6 animate-spin mx-auto mb-2" />
            <p>Analyzing optimal times...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {suggestions.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">No optimal times found in the next 2 weeks</p>
              <p className="text-slate-500 text-sm mt-2">Try adjusting the meeting duration or participant time zones</p>
            </div>
          ) : (
            suggestions.map((suggestion, index) => {
              const scoreColor = suggestion.score >= 80 ? 'text-green-400' :
                                suggestion.score >= 60 ? 'text-yellow-400' : 'text-red-400';
              
              const scoreBg = suggestion.score >= 80 ? 'bg-green-500/20' :
                             suggestion.score >= 60 ? 'bg-yellow-500/20' : 'bg-red-500/20';

              return (
                <div
                  key={index}
                  className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
                  onClick={() => onSelectTime(suggestion.dateTime, duration)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`px-2 py-1 rounded-full text-xs font-bold ${scoreBg} ${scoreColor}`}>
                        #{index + 1}
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className={`w-4 h-4 ${scoreColor}`} />
                        <span className={`font-bold ${scoreColor}`}>
                          {Math.round(suggestion.score)}% Match
                        </span>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-all">
                      Select
                    </button>
                  </div>

                  <div className="flex items-center gap-4 text-slate-300 mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{format(suggestion.dateTime, 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{format(suggestion.dateTime, 'HH:mm')}</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-400 mb-2">{suggestion.reasoning}</p>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{suggestion.suitableParticipants}/{suggestion.totalParticipants} participants in good hours</span>
                    <span>•</span>
                    <span>{formatDuration(duration)} meeting</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </GlassCard>
  );
};

export default SmartSuggestions;