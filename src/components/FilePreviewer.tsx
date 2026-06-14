'use client';

import { useState, useRef, useEffect } from "react";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Download, 
  FileVideo, 
  Music, 
  Image as ImageIcon, 
  FileText, 
  File as FileIcon, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Maximize2
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilePreviewerProps {
  filename: string;
  filesize: string;
  driveId: string;
  streamUrl: string;
  token: string;
}

export function FilePreviewer({ filename, filesize, driveId, streamUrl, token }: FilePreviewerProps) {
  const ext = filename.split('.').pop()?.toLowerCase() || "";
  
  // Media categories
  const isVideo = ["mp4", "webm", "mkv", "ogg", "mov", "avi", "3gp", "flv", "ts"].includes(ext);
  const isAudio = ["mp3", "wav", "ogg", "m4a", "aac", "flac", "wma"].includes(ext);
  const isImage = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico"].includes(ext);
  const isPdf = ext === "pdf";

  // Audio player state
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Sync audio state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [isAudio]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.log("Play interrupted:", err));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const val = parseFloat(e.target.value);
    audioRef.current.currentTime = val;
    setCurrentTime(val);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const val = parseFloat(e.target.value);
    audioRef.current.volume = val;
    setVolume(val);
    if (val > 0 && isMuted) {
      audioRef.current.muted = false;
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Helper to render file icon based on category
  const renderFileIcon = (sizeClass = "w-16 h-16") => {
    if (isVideo) return <FileVideo className={`${sizeClass} text-blue-400`} />;
    if (isAudio) return <Music className={`${sizeClass} text-emerald-400`} />;
    if (isImage) return <ImageIcon className={`${sizeClass} text-purple-400`} />;
    if (isPdf) return <FileText className={`${sizeClass} text-rose-400`} />;
    return <FileIcon className={`${sizeClass} text-amber-400`} />;
  };

  return (
    <div className="w-full space-y-8">
      {/* CSS Styles for customized items */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-vinyl {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .vinyl-spin {
          animation: spin-vinyl 15s linear infinite;
        }
        .vinyl-paused {
          animation-play-state: paused;
        }
        @keyframes bar-bounce {
          0%, 100% { height: 15%; }
          50% { height: 100%; }
        }
        .animate-bar-bounce {
          animation: bar-bounce 1s ease-in-out infinite;
        }
      `}} />

      {/* Main Preview Container */}
      <div className="relative w-full rounded-[2rem] overflow-hidden bg-[#0a0a0c] border border-white/10 shadow-2xl ring-1 ring-white/10 p-6 sm:p-8 flex flex-col items-center justify-center min-h-[400px]">
        {/* Dynamic content rendering based on format */}
        {isVideo && (
          <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black relative">
            <video
              src={streamUrl}
              controls
              className="w-full h-full object-contain"
              controlsList="nodownload"
            />
            {ext === "mkv" && (
              <div className="absolute top-4 left-4 right-4 bg-black/80 backdrop-blur-sm border border-yellow-500/30 text-yellow-500 p-3 rounded-xl flex items-start gap-2 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">MKV File Detected:</span> Chrome/Firefox browsers do not natively support all audio codecs (like AC3/DTS) in MKV containers. If there is no sound or it won't play, please use the download button below.
                </div>
              </div>
            )}
          </div>
        )}

        {isAudio && (
          <div className="w-full max-w-xl flex flex-col items-center p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl">
            {/* Hidden HTML5 Audio Element */}
            <audio ref={audioRef} src={streamUrl} />

            {/* Vinyl Record Visualizer */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 mb-8 flex items-center justify-center">
              {/* Outer Vinyl Glow */}
              <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20 blur-xl transition-all duration-1000 ${isPlaying ? 'scale-110 opacity-100' : 'scale-95 opacity-50'}`} />
              
              {/* Vinyl Groove Disc */}
              <div className={`w-full h-full rounded-full bg-neutral-900 border-[6px] border-neutral-800 shadow-2xl flex items-center justify-center vinyl-spin ${isPlaying ? '' : 'vinyl-paused'}`}>
                {/* Vinyl Grooves details */}
                <div className="absolute inset-4 rounded-full border border-neutral-700/30" />
                <div className="absolute inset-8 rounded-full border border-neutral-700/20" />
                <div className="absolute inset-12 rounded-full border border-neutral-700/30" />
                
                {/* Center Label */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-emerald-600 to-blue-600 border-4 border-neutral-900 flex items-center justify-center shadow-lg relative overflow-hidden">
                  <Music className="w-8 h-8 text-white/90" />
                  <div className="absolute inset-0 bg-white/10 mix-blend-overlay" />
                </div>
                {/* Center Spindle Hole */}
                <div className="absolute w-3 h-3 rounded-full bg-black border border-neutral-800" />
              </div>
            </div>

            {/* Bouncing Waveform Equalizer (Only shows when playing/paused) */}
            <div className="h-10 flex items-end gap-1.5 mb-6">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 bg-emerald-500 rounded-full transition-all duration-300 ${isPlaying ? 'animate-bar-bounce' : 'h-1.5'}`}
                  style={{
                    animationDelay: `${i * 0.07}s`,
                    animationDuration: isPlaying ? `${0.5 + Math.random() * 0.7}s` : '0s'
                  }}
                />
              ))}
            </div>

            {/* Song Meta Information */}
            <div className="text-center w-full mb-6">
              <h3 className="text-white font-bold text-lg line-clamp-1 px-4">{filename}</h3>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{filesize}</p>
            </div>

            {/* Custom Control Layout */}
            <div className="w-full space-y-4 px-2">
              {/* Progress Slider */}
              <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground font-mono">
                <span>{formatTime(currentTime)}</span>
                <input 
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 accent-emerald-500 bg-white/10 hover:bg-white/20 h-1.5 rounded-full cursor-pointer transition-all outline-none"
                />
                <span>{formatTime(duration)}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-6 pt-2">
                {/* Volume Button & Slider */}
                <div className="flex items-center gap-2 group w-24">
                  <button 
                    onClick={toggleMute}
                    className="p-2 text-white/70 hover:text-white transition-colors"
                  >
                    {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 accent-emerald-500 bg-white/15 h-1 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity outline-none"
                  />
                </div>

                {/* Main Play/Pause */}
                <button 
                  onClick={togglePlay}
                  className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20"
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                </button>

                {/* Empty spacer to balance layout */}
                <div className="w-24" />
              </div>
            </div>
          </div>
        )}

        {isImage && (
          <div className="w-full flex flex-col items-center justify-center p-2">
            <img
              src={streamUrl}
              alt={filename}
              className="max-h-[65vh] w-auto max-w-full rounded-2xl border border-white/10 shadow-2xl object-contain"
            />
          </div>
        )}

        {isPdf && (
          <div className="w-full flex flex-col items-center space-y-4">
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(streamUrl)}&embedded=true`}
              className="w-full aspect-video max-h-[70vh] rounded-2xl border border-white/10 bg-white"
            />
            <Button asChild variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 gap-2">
              <a href={streamUrl} target="_blank" rel="noreferrer">
                <Maximize2 className="w-4 h-4" />
                Open PDF in New Tab
              </a>
            </Button>
          </div>
        )}

        {/* Fallback for other file types */}
        {!isVideo && !isAudio && !isImage && !isPdf && (
          <div className="text-center p-6 space-y-4">
            <div className="flex justify-center mb-2">{renderFileIcon("w-20 h-20")}</div>
            <h3 className="text-white font-extrabold text-2xl">{filename}</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Preview is not supported for this file type ({ext.toUpperCase()}). You can still download the file to open it on your device.
            </p>
          </div>
        )}
      </div>

      {/* Control / File Info Dashboard Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info Column */}
        <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6 flex items-start gap-4">
          <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
            {renderFileIcon("w-10 h-10")}
          </div>
          <div className="space-y-2 flex-1 min-w-0">
            <h2 className="text-white font-bold text-xl line-clamp-2 leading-snug">{filename}</h2>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground font-medium pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Format: <span className="text-white uppercase">{ext || "unknown"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Size: <span className="text-white">{filesize}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Column */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-center gap-4">
          <Button asChild size="lg" className="gradient-primary text-primary-foreground font-black shadow-lg rounded-2xl h-14 hover:scale-[1.02] active:scale-[0.98] transition-transform">
            <a href={streamUrl} download={filename}>
              <Download className="w-5 h-5 mr-2" />
              Download File
            </a>
          </Button>

          <Button asChild variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-2xl h-12">
            <a href={`/download/${driveId}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2">
              Go to Download Page
              <ChevronRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
