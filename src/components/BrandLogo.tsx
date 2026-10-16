import React, { useState } from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  brandName?: string;
  subtitle?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
  brandName = 'AJSUM',
  subtitle = 'Search Lead Extractor & Marketing CRM'
}) => {
  const [imgError, setImgError] = useState(false);

  // Dimension mapping
  const sizeMap = {
    sm: { container: 'w-8 h-8 rounded-lg', img: 'w-8 h-8', text: 'text-sm', badge: 'text-[9px] px-1.5 py-0.2' },
    md: { container: 'w-10 h-10 rounded-xl', img: 'w-10 h-10', text: 'text-base', badge: 'text-[10px] px-2 py-0.5' },
    lg: { container: 'w-12 h-12 rounded-xl', img: 'w-12 h-12', text: 'text-lg', badge: 'text-[11px] px-2.5 py-0.5' },
    xl: { container: 'w-16 h-16 rounded-2xl', img: 'w-16 h-16', text: 'text-xl', badge: 'text-xs px-3 py-1' }
  }[size];

  const logoImagePath = '/src/assets/images/as_metallic_logo_1792168089945.jpg';

  return (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      {/* Metallic Logo Emblem Container */}
      <div
        className={`${sizeMap.container} relative flex items-center justify-center overflow-hidden bg-black border border-white/20 shadow-xl shadow-black/80 ring-1 ring-white/10 transition-transform duration-200 hover:scale-105`}
        title={`${brandName} CRM`}
      >
        {!imgError ? (
          <img
            src={logoImagePath}
            alt={`${brandName} Logo Emblem`}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className={`${sizeMap.img} object-cover transform scale-110`}
          />
        ) : (
          /* High-fidelity SVG Fallback matching the metallic triangular emblem */
          <svg viewBox="0 0 100 100" className="w-full h-full p-1.5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="25%" stopColor="#CBD5E1" />
                <stop offset="50%" stopColor="#64748B" />
                <stop offset="75%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#94A3B8" />
              </linearGradient>
            </defs>
            {/* Triangular Outer Frame */}
            <polygon points="50,15 15,85 85,85" stroke="url(#silverGrad)" strokeWidth="8" strokeLinejoin="round" />
            {/* Intersecting S Shape */}
            <path
              d="M 68 45 C 60 40 40 40 38 52 C 36 64 64 62 62 74 C 60 82 40 82 30 76"
              stroke="url(#silverGrad)"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        )}
      </div>

      {/* Optional Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold tracking-wider text-white flex items-center gap-1.5">
              <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent font-black tracking-widest text-lg sm:text-xl drop-shadow-sm">
                {brandName}
              </span>
            </span>
            <span className={`bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-400 font-semibold rounded-full border border-blue-500/30 tracking-wider uppercase ${sizeMap.badge}`}>
              CRM
            </span>
          </div>
          {subtitle && (
            <p className="text-[11px] text-slate-400 font-light truncate max-w-xs sm:max-w-md">
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
