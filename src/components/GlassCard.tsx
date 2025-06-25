import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hover = false }) => {
  return (
    <div className={`
      backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl
      shadow-2xl shadow-cyan-500/10
      ${hover ? 'hover:bg-white/10 hover:border-cyan-500/30 hover:shadow-cyan-500/20 transition-all duration-300' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default GlassCard;