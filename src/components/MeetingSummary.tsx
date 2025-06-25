import React, { useState } from 'react';
import { MeetingProposal, Participant } from '../types';
import { format } from 'date-fns';
import { getDateTimeInZone, formatDuration } from '../utils/timeZoneUtils';
import { Copy, Download, Share2, Calendar, CheckCircle } from 'lucide-react';
import GlassCard from './GlassCard';

interface MeetingSummaryProps {
  proposals: MeetingProposal[];
  participants: Participant[];
}

const MeetingSummary: React.FC<MeetingSummaryProps> = ({ proposals, participants }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (proposals.length === 0) {
    return null;
  }

  const generateMeetingText = (proposal: MeetingProposal): string => {
    const lines = [
      `📅 ${proposal.title || 'Meeting'}`,
      `⏰ Duration: ${formatDuration(proposal.duration)}`,
      '',
      '🌍 Time for each participant:',
    ];

    participants.forEach(participant => {
      const localDateTime = getDateTimeInZone(proposal.dateTime, participant.timeZone);
      const score = proposal.suitabilityScores[participant.id];
      const emoji = score?.level === 'optimal' ? '✅' : score?.level === 'acceptable' ? '⚠️' : '❌';
      lines.push(`${emoji} ${participant.flag} ${participant.name}: ${localDateTime}`);
    });

    return lines.join('\n');
  };

  const copyToClipboard = async (text: string, proposalId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(proposalId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const generateCalendarUrl = (proposal: MeetingProposal): string => {
    const startDate = proposal.dateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(proposal.dateTime.getTime() + proposal.duration * 60000)
      .toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const title = encodeURIComponent(proposal.title || 'Meeting');
    const details = encodeURIComponent(generateMeetingText(proposal));
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}`;
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Share2 className="w-6 h-6 text-cyan-400" />
        <h2 className="text-xl font-bold text-white">Meeting Summary & Export</h2>
      </div>

      <div className="space-y-6">
        {proposals.map(proposal => (
          <div key={proposal.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {proposal.title || 'Untitled Meeting'}
                </h3>
                <p className="text-slate-400 text-sm">
                  {format(proposal.dateTime, 'EEEE, MMMM dd, yyyy')} • {formatDuration(proposal.duration)}
                </p>
              </div>
            </div>

            <div className="mb-4 p-3 bg-slate-800/50 rounded-lg font-mono text-sm text-slate-300 whitespace-pre-line">
              {generateMeetingText(proposal)}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => copyToClipboard(generateMeetingText(proposal), proposal.id)}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors text-sm"
              >
                {copiedId === proposal.id ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Text
                  </>
                )}
              </button>

              <a
                href={generateCalendarUrl(proposal)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors text-sm"
              >
                <Calendar className="w-4 h-4" />
                Add to Google Calendar
              </a>

              <button
                onClick={() => {
                  const blob = new Blob([generateMeetingText(proposal)], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `meeting-${format(proposal.dateTime, 'yyyy-MM-dd-HHmm')}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default MeetingSummary;