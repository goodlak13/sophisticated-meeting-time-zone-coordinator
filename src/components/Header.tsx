import React from 'react';
import { Clock, Globe } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="relative z-10 p-6 text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="relative">
          <Globe className="w-10 h-10 text-cyan-400 animate-pulse" />
          <Clock className="w-6 h-6 text-white absolute -bottom-1 -right-1 bg-slate-800 rounded-full p-1" />
        </div>
      </div>
      
      <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent mb-4">
        TimeSync Pro
      </h1>
      
      <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
        Coordinate meetings across time zones with intelligent scheduling and beautiful visualizations
      </p>
      
      <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Optimal Hours</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span>Acceptable Hours</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Poor Hours</span>
        </div>
      </div>
    </header>
  );
};

export default Header;