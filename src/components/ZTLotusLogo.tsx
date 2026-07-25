import React from 'react';

interface ZTLotusLogoProps {
  className?: string;
  size?: number;
  theme?: 'dark' | 'light';
  variant?: 'full' | 'monogram-only';
}

/**
 * ZTLotusLogo renders the brand logo adapted from the lotus flower monogram design.
 * Features a delicate periwinkle/lavender-blue lotus flower outline with
 * intertwined serif letters 'Z' and 'T' centered.
 */
export const ZTLotusLogo: React.FC<ZTLotusLogoProps> = ({
  className = '',
  size = 40,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  // Colors accurately matched to user uploaded image:
  // - Background lotus: soft periwinkle / lavender blue line art (#9bb0e5 / #a5b4fc)
  // - Foreground ZT Monogram: deep navy blue (#132247 / #0f172a in light, crisp slate/white with navy shadow in dark)
  const lotusStroke = isDark ? '#a5b4fc' : '#94a3b8';
  const ztColor = isDark ? '#ffffff' : '#111e38';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none ${className}`}
      aria-label="ZT Lotus Logo"
    >
      <defs>
        {/* Soft drop shadow for ZT letters */}
        <filter id="zt-text-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000000" floodOpacity={isDark ? '0.5' : '0.12'} />
        </filter>

        <linearGradient id="lotus-line-grad" x1="100" y1="20" x2="100" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isDark ? '#c084fc' : '#818cf8'} stopOpacity="0.9" />
          <stop offset="50%" stopColor={lotusStroke} stopOpacity="0.85" />
          <stop offset="100%" stopColor={isDark ? '#818cf8' : '#6366f1'} stopOpacity="0.75" />
        </linearGradient>
      </defs>

      {/* --- BACKGROUND LOTUS FLOWER (Outlined Petals) --- */}
      <g stroke="url(#lotus-line-grad)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Center top petal */}
        <path d="M 100 24 C 112 50, 122 80, 100 148 C 78 80, 88 50, 100 24 Z" opacity="0.95" />

        {/* Inner high side petals */}
        <path d="M 100 148 C 126 70, 150 62, 158 82 C 162 102, 132 135, 100 148 Z" opacity="0.85" />
        <path d="M 100 148 C 74 70, 50 62, 42 82 C 38 102, 68 135, 100 148 Z" opacity="0.85" />

        {/* Mid side petals */}
        <path d="M 100 148 C 146 88, 175 92, 182 115 C 185 136, 142 152, 100 148 Z" opacity="0.8" />
        <path d="M 100 148 C 54 88, 25 92, 18 115 C 15 136, 58 152, 100 148 Z" opacity="0.8" />

        {/* Outer low wide petals */}
        <path d="M 100 148 C 155 118, 192 128, 188 152 C 178 170, 128 160, 100 148 Z" opacity="0.75" />
        <path d="M 100 148 C 45 118, 8 128, 12 152 C 22 170, 72 160, 100 148 Z" opacity="0.75" />

        {/* Bottom center cup curve */}
        <path d="M 68 152 C 84 172, 116 172, 132 152 C 120 182, 80 182, 68 152 Z" opacity="0.9" />
      </g>

      {/* --- FOREGROUND SERIF "ZT" MONOGRAM --- */}
      <g filter="url(#zt-text-shadow)" fill={ztColor}>
        {/* Render precise Z and T serif text matching the image */}
        <text
          x="100"
          y="130"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', Times, serif"
          fontSize="82"
          fontWeight="bold"
          letterSpacing="-3"
        >
          ZT
        </text>
      </g>
    </svg>
  );
};
