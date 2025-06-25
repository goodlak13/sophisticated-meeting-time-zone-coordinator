import React, { useState } from 'react';
import { Participant } from '../types';
import { popularCities } from '../data/timezones';
import { Plus, Search } from 'lucide-react';
import GlassCard from './GlassCard';

interface AddParticipantFormProps {
  onAdd: (participant: Omit<Participant, 'id'>) => void;
}

const AddParticipantForm: React.FC<AddParticipantFormProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<{ name: string; timeZone: string; flag: string } | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredCities = popularCities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && selectedCity) {
      onAdd({
        name: name.trim(),
        location: selectedCity.name,
        timeZone: selectedCity.timeZone,
        flag: selectedCity.flag,
        importance: 'medium'
      });
      setName('');
      setSearchTerm('');
      setSelectedCity(null);
      setIsExpanded(false);
    }
  };

  if (!isExpanded) {
    return (
      <GlassCard className="p-6" hover>
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center justify-center gap-3 py-8 text-cyan-400 hover:text-cyan-300 transition-colors group"
        >
          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
          <span className="text-lg font-medium">Add Participant</span>
        </button>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            placeholder="Enter participant name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Location
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              placeholder="Search for a city"
            />
          </div>

          {searchTerm && (
            <div className="mt-2 max-h-40 overflow-y-auto bg-slate-800/90 border border-white/10 rounded-lg">
              {filteredCities.map((city) => (
                <button
                  key={city.name}
                  type="button"
                  onClick={() => {
                    setSelectedCity(city);
                    setSearchTerm(city.name);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-white/5 flex items-center gap-3 transition-colors"
                >
                  <span className="text-lg">{city.flag}</span>
                  <div>
                    <div className="text-white font-medium">{city.name}</div>
                    <div className="text-slate-400 text-sm">{city.timeZone}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={!name.trim() || !selectedCity}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-cyan-500/25"
          >
            Add Participant
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

export default AddParticipantForm;