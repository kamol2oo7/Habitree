import React from 'react';

interface AppLogoProps {
  size?: number;
  color?: string;
  className?: string;
}

export default function AppLogo({ 
  size = 32, 
  color = '#4E7D5B', 
  className = '' 
}: AppLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 1. Base Horizontal Bar */}
      <rect 
        x="36" 
        y="78" 
        width="28" 
        height="8" 
        rx="1.5" 
        fill={color} 
      />

      {/* 2. Main Left-Curved Trunk */}
      <path
        d="M 50 73 C 47.5 52 42 39 48 17"
        stroke={color}
        strokeWidth="7.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* 3. Right Curved Branch */}
      <path
        d="M 50 73 C 50.5 56 60 42 78 42"
        stroke={color}
        strokeWidth="7.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* 4. Left Horizontal-to-Curved Branch */}
      <path
        d="M 22 45 L 42 45 C 33 53 28 61 28 63"
        stroke={color}
        strokeWidth="7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* 5. Top-Right Diagonal Branch */}
      <line
        x1="54"
        y1="36"
        x2="72"
        y2="24"
        stroke={color}
        strokeWidth="7.5"
        strokeLinecap="round"
      />

      {/* 6. Top-Left Diamond Leaf */}
      <rect
        x="29"
        y="25"
        width="7"
        height="7"
        fill={color}
        transform="rotate(45 32.5 28.5)"
        rx="0.5"
      />

      {/* 7. Bottom-Right Diamond Leaf */}
      <rect
        x="64"
        y="58"
        width="7"
        height="7"
        fill={color}
        transform="rotate(45 67.5 61.5)"
        rx="0.5"
      />
    </svg>
  );
}
