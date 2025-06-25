import React, { useState } from 'react';
import { Participant } from '../types';
import { Calendar, Clock, Plus } from 'lucide-react';
import GlassCard from './GlassCard';

interface MeetingProposalFormProps {
  participants: Participant[];
  onAddProposal: (dateTime: Date, duration: number, title?: string) => void;
}

const MeetingProposalForm: React.FC<MeetingProposalFormProps> = ({ participants, onAddProposal }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [title, setTitle] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && time) {
      const dateTime = new Date(`${date}T${time}`);
      onAddProposal(dateTime, duration, title || undefined);
      setDate('');
      setTime('');
      setTitle('');
      setIsExpanded(false);
    }
  };

  if (participants.length === 0) {
    return (
      <GlassCard className="p-6">
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-400">Add participants first to propose meeting times</p>
        </div>
      </GlassCard>
    );
  }

  if (!isExpanded) {
    return (
      <GlassCard className="p-6" hover>
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center justify-center gap-3 py-8 text-cyan-400 hover:text-cyan-300 transition-colors group"
        >
          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
          <span className="text-lg font-medium">Propose Meeting Time</span>
        </button>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Meeting Title (Optional)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            placeholder="e.g., Weekly Team Sync"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Duration
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>1 hour</option>
            <option value={90}>1.5 hours</option>
            <option value={120}>2 hours</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-500 hover:to-blue-500 transition-all duration-200 shadow-lg shadow-cyan-500/25"
          >
            Add Proposal
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="px-4 py-3 bg-white/5 text-slate-300 rounded-lg font-medium hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </GlassCard>
  );
};

export default MeetingProposalForm;