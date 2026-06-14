'use client';

import { useEffect } from 'react';

interface AdControllerProps {
  popunderCode?: string;
  socialBarCode?: string;
  directLink?: string;
}

export function AdController({ popunderCode, socialBarCode, directLink }: AdControllerProps) {
  useEffect(() => {
    const activeScripts: HTMLScriptElement[] = [];
    const activeListeners: Array<{ type: string; fn: any }> = [];

    const injectScript = (code: string, id: string) => {
      if (!code) return;
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(code, 'text/html');
        const scripts = doc.querySelectorAll('script');
        
        scripts.forEach((s, idx) => {
          const newScript = document.createElement('script');
          if (s.src) {
            newScript.src = s.src;
          } else {
            newScript.textContent = s.textContent;
          }
          newScript.setAttribute('data-ad-injected', id + '-' + idx);
          document.body.appendChild(newScript);
          activeScripts.push(newScript);
        });
      } catch (err) {
        console.error(`Failed to inject ad script for ${id}:`, err);
      }
    };

    if (popunderCode) {
      injectScript(popunderCode, 'popunder');
    }

    if (socialBarCode) {
      injectScript(socialBarCode, 'socialbar');
    }

    if (directLink) {
      const handleFirstClick = () => {
        window.open(directLink, '_blank');
        document.removeEventListener('click', handleFirstClick);
      };
      document.addEventListener('click', handleFirstClick);
      activeListeners.push({ type: 'click', fn: handleFirstClick });
    }

    return () => {
      activeScripts.forEach(script => {
        try {
          script.remove();
        } catch (e) {}
      });
      activeListeners.forEach(listener => {
        document.removeEventListener(listener.type, listener.fn);
      });
    };
  }, [popunderCode, socialBarCode, directLink]);

  return null;
}
