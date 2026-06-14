'use client';

import { useState } from "react";
import { CirclePlay, X, Maximize2, MonitorPlay } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WatchPlayer({ driveId }: { driveId: string }) {
  const [showPlayer, setShowPlayer] = useState(false);

  if (!showPlayer) {
    return (
      <button 
        onClick={() => setShowPlayer(true)}
        className="dl-btnbar c-watch w-full text-left border-0 cursor-pointer"
      >
        <span className="l">
          <span className="dl-okTick">
            <CirclePlay className="w-3.5 h-3.5" />
          </span>
          <MonitorPlay className="w-5 h-5" />
          <span className="txt">WATCH ONLINE (Instantly)</span>
        </span>
        <span className="r">
          <span className="dl-badge">PLAY NOW</span>
          <Maximize2 className="w-5 h-5" />
        </span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm animate-in fade-in duration-300 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl animate-in zoom-in-95 duration-500">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MonitorPlay className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <div>
              <h3 className="text-white font-bold leading-none">Instant Cinema</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">High Definition Stream</p>
            </div>
          </div>
          <button 
            onClick={() => setShowPlayer(false)}
            className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-destructive/20 hover:text-destructive rounded-full transition-all group"
          >
            <X className="w-6 h-6 group-hover:scale-110" />
          </button>
        </div>

        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5 ring-1 ring-white/10 glow-primary">
          <iframe
            src={`https://new.drivecloud.cc/watch/${driveId}`}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            allow="autoplay; encrypted-media"
          />
        </div>
        
        <div className="mt-6 flex justify-center">
          <Button 
            variant="ghost" 
            onClick={() => setShowPlayer(false)}
            className="text-muted-foreground hover:text-white font-bold tracking-widest uppercase text-xs gap-2"
          >
            <X className="w-4 h-4" />
            Close Player
          </Button>
        </div>
      </div>
    </div>
  );
}
