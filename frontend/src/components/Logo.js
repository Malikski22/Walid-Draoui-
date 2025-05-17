import React from 'react';

const Logo = ({ size = 'default' }) => {
  const sizeClasses = {
    small: 'h-6',
    default: 'h-8',
    large: 'h-12',
  };

  return (
    <div className="flex items-center">
      <svg 
        className={`${sizeClasses[size]} w-auto text-blue-700`} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M50 10L90 30V70L50 90L10 70V30L50 10Z" 
          fill="currentColor" 
          fillOpacity="0.2" 
        />
        <path 
          d="M50 10L90 30V70L50 90L10 70V30L50 10Z" 
          stroke="currentColor" 
          strokeWidth="4" 
        />
        <path 
          d="M35 40H65V70H35V40Z" 
          fill="currentColor" 
        />
        <path 
          d="M45 30H55V40H45V30Z" 
          fill="currentColor" 
        />
        <circle 
          cx="50" 
          cy="55" 
          r="5" 
          fill="white" 
        />
      </svg>
      <span className="mr-2 font-bold text-blue-700">DzSmartBooking</span>
    </div>
  );
};

export default Logo;
