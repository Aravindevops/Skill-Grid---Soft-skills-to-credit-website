import React from 'react';

export const Logo: React.FC<React.SVGProps<SVGSVGElement>> = ({ className = "w-8 h-8", ...props }) => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="square" strokeLinejoin="miter" className={className} {...props}>
    {/* S */}
    <path d="M 43 15 L 15 15 L 15 45 L 30 45 L 43 58 L 43 85 L 15 85 L 15 65" />
    {/* G */}
    <path d="M 57 15 L 85 15 L 85 85 L 57 85 L 57 52 L 72 52 L 72 70 L 62 70" />
  </svg>
);
