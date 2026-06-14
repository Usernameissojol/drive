import { MonitorPlay, X, ArrowLeft, Home, FileVideo } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import pool from "@/lib/db";
import { getDirectLink } from "@/app/actions/drive";
import { FilePreviewer } from "@/components/FilePreviewer";

export default async function WatchPage({ params }: { params: { token: string } }) {
  const { token } = await params;

  // 1. Try to find the file in drive_files by token
  let file = null;
  let link = null;

  try {
    const [fileRows]: any = await pool.execute(
      'SELECT * FROM drive_files WHERE token = ?',
      [token]
    );

    if (fileRows && fileRows.length > 0) {
      file = fileRows[0];
      // Find the associated file_link to get the provider link
      const [linkRows]: any = await pool.execute(
        'SELECT * FROM file_links WHERE file_id = ? LIMIT 1',
        [file.id]
      );
      if (linkRows && linkRows.length > 0) {
        link = linkRows[0];
      }
    } else {
      // 2. Try to find the file in file_links by token
      const [linkRows]: any = await pool.execute(
        `SELECT fl.*, df.id as db_file_id, df.filename, df.filesize, df.drive_id 
         FROM file_links fl
         JOIN drive_files df ON fl.file_id = df.id
         WHERE fl.token = ? LIMIT 1`,
        [token]
      );
      if (linkRows && linkRows.length > 0) {
        link = linkRows[0];
        file = {
          id: link.db_file_id,
          drive_id: link.drive_id,
          filename: link.filename,
          filesize: link.filesize,
          token: link.token,
        };
      }
    }
  } catch (error) {
    console.error("Database query error in WatchPage:", error);
  }

  // Get direct link if the file exists
  let streamUrl = "";
  if (file) {
    if (link) {
      try {
        streamUrl = await getDirectLink(link.id);
      } catch (err) {
        console.error("Failed to get direct link from provider, falling back to Google Drive direct URL:", err);
      }
    }
    
    if (!streamUrl && file.drive_id) {
      streamUrl = `https://drive.google.com/uc?export=download&id=${file.drive_id}`;
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@400;500;600;700;800&display=swap');
        body {
          margin: 0;
          background: #000;
          font-family: "Baloo Da 2", system-ui, sans-serif;
        }
        .glow-primary {
          box-shadow: 0 0 40px rgba(37,99,235,0.15);
        }
      `}} />

      <div className="w-full max-w-6xl space-y-6">
        {/* Cinema Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
          <div className="flex items-center gap-4">
            <Link href="/" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all">
              <Home className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Live Preview Mode
              </div>
              <h1 className="text-xl font-black text-white leading-tight">
                {file ? "Streaming Content" : "Streaming in High Definition"}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="hidden sm:block text-right mr-2">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">System Status</p>
                <p className="text-xs text-green-500 font-bold">Stable Connection</p>
             </div>
             {file && (
               <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl h-11 px-6 font-bold" asChild>
                  <Link href={`/download/${file.id}`}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to File Page
                  </Link>
               </Button>
             )}
          </div>
        </div>

        {/* Video / Preview Container */}
        {file ? (
          <FilePreviewer
            filename={file.filename || "file"}
            filesize={file.filesize || "Unknown"}
            driveId={file.id}
            streamUrl={streamUrl}
            token={token}
          />
        ) : (
          <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden bg-[#050505] border border-white/5 shadow-2xl ring-1 ring-white/10 glow-primary">
            <iframe
              src={`https://new.drivecloud.cc/watch/${token}`}
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              allow="autoplay; encrypted-media"
            />
          </div>
        )}

        {/* Footer Info */}
        <div className="flex flex-col items-center gap-4 py-4 text-center">
            <p className="text-muted-foreground text-sm max-w-lg">
              You are watching a secure preview stream powered by DriveLink Studio. 
              The media is processed and streamed directly for the best possible quality.
            </p>
            <div className="flex gap-6">
                <div className="flex items-center gap-2 text-xs font-bold text-white/40">
                    <MonitorPlay className="w-4 h-4" />
                    4K/FHD SUPPORT
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-white/40">
                    <X className="w-4 h-4" />
                    NO ADS
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
