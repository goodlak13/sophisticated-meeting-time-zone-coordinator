import React, { useState } from 'react';
import { useParticipants } from './hooks/useParticipants';
import { useMeetingProposals } from './hooks/useMeetingProposals';
import AnimatedBackground from './components/AnimatedBackground';
import Header from './components/Header';
import ParticipantCard from './components/ParticipantCard';
import AddParticipantForm from './components/AddParticipantForm';
import MeetingProposalForm from './components/MeetingProposalForm';
import ProposalCard from './components/ProposalCard';
import SmartSuggestions from './components/SmartSuggestions';
import MeetingSummary from './components/MeetingSummary';
import ConfirmationModal from './components/ConfirmationModal';
import { RotateCcw, AlertTriangle } from 'lucide-react';

function App() {
  const { participants, addParticipant, removeParticipant, updateParticipant, clearParticipants } = useParticipants();
  const { proposals, addProposal, removeProposal, clearProposals } = useMeetingProposals();
  const [showResetModal, setShowResetModal] = useState(false);

  const handleAddProposal = (dateTime: Date, duration: number, title?: string) => {
    addProposal(dateTime, duration, participants, title);
  };

  const handleSelectSuggestedTime = (dateTime: Date, duration: number) => {
    addProposal(dateTime, duration, participants, 'AI Suggested Meeting');
  };

  const handleReset = () => {
    clearParticipants();
    clearProposals();
    setShowResetModal(false);
  };

  const hasData = participants.length > 0 || proposals.length > 0;

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 pb-12">
          {/* Participants Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
              Participants ({participants.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {participants.map(participant => (
                <ParticipantCard
                  key={participant.id}
                  participant={participant}
                  onRemove={removeParticipant}
                  onUpdate={updateParticipant}
                />
              ))}
              <AddParticipantForm onAdd={addParticipant} />
            </div>
          </section>

          {participants.length > 0 && (
            <>
              {/* Smart Suggestions */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-purple-400 to-cyan-500 rounded-full"></div>
                  Smart Suggestions
                </h2>
                <SmartSuggestions
                  participants={participants}
                  onSelectTime={handleSelectSuggestedTime}
                />
              </section>

              {/* Meeting Proposals */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-green-400 to-cyan-500 rounded-full"></div>
                  Meeting Proposals ({proposals.length})
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <MeetingProposalForm
                    participants={participants}
                    onAddProposal={handleAddProposal}
                  />
                  {proposals.map(proposal => (
                    <ProposalCard
                      key={proposal.id}
                      proposal={proposal}
                      participants={participants}
                      onRemove={removeProposal}
                    />
                  ))}
                </div>
              </section>

              {/* Meeting Summary */}
              {proposals.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="w-2 h-8 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full"></div>
                    Export & Share
                  </h2>
                  <MeetingSummary proposals={proposals} participants={participants} />
                </section>
              )}
            </>
          )}

          {/* Reset Button */}
          {hasData && (
            <section className="mb-12">
              <div className="flex justify-center">
                <button
                  onClick={() => setShowResetModal(true)}
                  className="flex items-center gap-3 px-6 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm group"
                >
                  <AlertTriangle className="w-5 h-5" />
                  <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
                  <span>Reset Everything</span>
                </button>
              </div>
              <p className="text-center text-slate-500 text-sm mt-2">
                This will clear all participants and meeting proposals
              </p>
            </section>
          )}
        </main>
      </div>

      {/* Bolt Badge */}
      <a
        href="https://bolt.new/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 hover:scale-110 transition-transform duration-200 hover:drop-shadow-2xl"
        title="Powered by Bolt"
      >
        <img
          src="/black_circle_360x360.png"
          alt="Powered by Bolt"
          className="w-16 h-16 rounded-full shadow-lg hover:shadow-2xl transition-shadow duration-200"
        />
      </a>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleReset}
        title="Reset Everything"
        message="Are you sure you want to reset everything? This will permanently clear all participants and meeting proposals. This action cannot be undone."
        confirmText="Yes, Reset All"
        cancelText="Cancel"
      />
    </div>
  );
}

export default App;