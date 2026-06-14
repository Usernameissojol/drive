'use client';

import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface AdBannerProps {
  code?: string;
  placement: 'top' | 'native';
  className?: string;
}

export function AdBanner({ code, placement, className = '' }: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!code || !isVisible) return null;

  const getCodeHtml = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            overflow: hidden; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            min-height: 100vh;
            background: transparent;
          }
          img, iframe { 
            max-width: 100%; 
            height: auto; 
            display: block;
          }
        </style>
      </head>
      <body>
        ${code}
      </body>
      </html>
    `;
  };

  const isTop = placement === 'top';
  const minHeight = isTop ? '90px' : '250px';

  return (
    <div className={`w-full mx-auto my-4 ${className}`}>
      <div className="bg-[#f2f7ff]/70 border border-[#586e8f]/10 rounded-xl overflow-hidden shadow-sm flex flex-col items-center">
        <div className="px-3 py-1 bg-[#f1f5f9] w-full text-[9px] font-extrabold text-[#586e8f]/60 uppercase tracking-widest flex justify-between items-center border-b border-[#586e8f]/5 select-none">
          <span>Sponsored Advertisement</span>
          <Info className="w-2.5 h-2.5" />
        </div>
        
        <div className="w-full flex justify-center items-center relative py-2 bg-white/40">
          <iframe
            srcDoc={getCodeHtml()}
            style={{ 
              width: '100%', 
              border: 'none', 
              minHeight, 
              height: 'auto' 
            }}
            scrolling="no"
            frameBorder="0"
            title={`ad-${placement}`}
          />
        </div>
      </div>
    </div>
  );
}
