import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-20',
  };

  return (
    <svg 
      viewBox="0 0 380 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClasses[size]} w-auto ${className}`}
      aria-label="Aurora EADI Logo"
    >
      {/* Background Oval - Rotated slightly for dynamic feel */}
      <ellipse cx="55" cy="50" rx="52" ry="42" fill="#f97316" transform="rotate(-8 55 50)" />
      
      {/* AE Letters */}
      <text 
        x="55" 
        y="73" 
        fontFamily="Arial, sans-serif" 
        fontWeight="900" 
        fontSize="65" 
        fill="white" 
        textAnchor="middle"
        fontStyle="italic"
        letterSpacing="-5"
      >
        AE
      </text>

      {/* Text: AURORA EADI */}
      <text 
        x="120" 
        y="48" 
        fontFamily="sans-serif" 
        fontWeight="900" 
        fontSize="36" 
        fill="#333333"
        letterSpacing="-0.5"
      >
        AURORA EADI
      </text>

      {/* Text: Manaus */}
      <text 
        x="120" 
        y="82" 
        fontFamily="sans-serif" 
        fontWeight="500" 
        fontSize="30" 
        fill="#555555"
      >
        Manaus
      </text>
    </svg>
  );
};