'use client';

import { useState } from "react";
import { getDirectLink } from "@/app/actions/drive";
import { Check, Rocket, CirclePlay, ArrowUpRight, CloudDownload, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function DownloadButtons({ links }: { links: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDownload = async (linkId: string, isWatch: boolean, originalUrl: string) => {
    if (isWatch) {
      window.open(originalUrl, '_blank');
      return;
    }

    setLoadingId(linkId);
    try {
      const directUrl = await getDirectLink(linkId);
      
      // Using window.location.assign is more reliable for triggering direct downloads
      // If the URL is a direct file link, the browser will start the download 
      // without leaving the current page.
      window.location.assign(directUrl);
      
      toast.success("Requesting file...");
    } catch (error) {
      toast.error("Failed to generate direct link.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      {links.map((link: any, index: number) => {
        const isWatch = index % 2 === 1;
        const isLoading = loadingId === link.id;

        return (
          <button 
            key={link.id} 
            onClick={() => handleDownload(link.id, isWatch, link.download_url)}
            disabled={isLoading}
            className={`dl-btnbar w-full text-left border-0 cursor-pointer ${isWatch ? 'c-watch' : 'c-fsl'} ${isLoading ? 'opacity-70 grayscale-[0.5]' : ''}`}
          >
            <span className="l">
              <span className="dl-okTick">
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              </span>
              {isWatch ? <CirclePlay className="w-5 h-5" /> : <Rocket className="w-5 h-5" />}
              <span className="txt">
                {isLoading ? 'GENERATING...' : (isWatch ? 'Watch Online' : 'FAST DOWNLOAD (Cloud)')}
              </span>
            </span>
            <span className="r">
              <span className="dl-badge">{isWatch ? 'PLAY NOW' : '🚀CLOUD'}</span>
              {isWatch ? <ArrowUpRight className="w-5 h-5" /> : <CloudDownload className="w-5 h-5" />}
            </span>
          </button>
        );
      })}
    </>
  );
}
