import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  
  const sizeClasses = {
    sm: { ovalW: 'w-10', ovalH: 'h-6', text: 'text-[10px]', title: 'text-sm', sub: 'text-xs' },
    md: { ovalW: 'w-14', ovalH: 'h-9', text: 'text-base', title: 'text-xl', sub: 'text-base' },
    lg: { ovalW: 'w-20', ovalH: 'h-12', text: 'text-xl', title: 'text-2xl', sub: 'text-xl' },
  };

  const s = sizeClasses[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* AE Oval Icon */}
      <div className={`relative ${s.ovalW} ${s.ovalH} bg-primary-500 rounded-[50%] transform -skew-x-12 flex items-center justify-center shadow-sm shrink-0`}>
        <span className={`text-white font-bold italic transform skew-x-12 tracking-tighter leading-none ${s.text} font-sans`}>
          AE
        </span>
      </div>
      
      {/* Text Brand */}
      <div className="flex flex-col justify-center leading-none">
        <span className={`text-gray-900 font-extrabold tracking-wide ${s.title} italic`}>
          AURORA
        </span>
        <span className={`text-gray-900 font-bold tracking-widest ${s.sub} italic`}>
          EADI
        </span>
      </div>
    </div>
  );
};