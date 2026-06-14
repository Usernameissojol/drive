'use client';

import { useState } from "react";
import { generateLinks } from "@/app/actions/drive";
import { Button } from "@/components/ui/button";
import { FileResultCard } from "@/components/FileResultCard";
import { Sparkles, Trash2, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { DriveFile } from "@/types";

export default function AdminAddPage() {
  const [text, setText] = useState("");
  const [results, setResults] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    const links = text
      .split(/\r?\n|,/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (links.length === 0) {
      toast.error("Paste at least one Drive URL or ID");
      return;
    }
    if (links.length > 50) {
      toast.error("Maximum 50 links per batch");
      return;
    }

    setLoading(true);
    try {
      const out = await generateLinks(links);
      const records = out.map((r) => r.record).filter(Boolean) as DriveFile[];
      setResults(records);
      const ok = out.filter((r) => r.success).length;
      const failed = out.length - ok;
      if (ok) toast.success(`${ok} link${ok > 1 ? "s" : ""} generated`);
      if (failed) toast.error(`${failed} failed`);
    } catch (e: any) {
      toast.error(e?.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const copyAll = async () => {
    const urls = results.filter((r) => r.download_url).map((r) => r.download_url!).join("\n");
    if (!urls) return toast.error("No links to copy");
    await navigator.clipboard.writeText(urls);
    toast.success("All links copied");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-5xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-white">Generate download links</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Paste up to 50 Google Drive URLs or file IDs, one per line.
        </p>
      </header>

      <div className="glass-card rounded-2xl p-4 sm:p-6 bg-white/5 border border-white/5">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`https://drive.google.com/file/d/1AbCdEf...\nhttps://drive.google.com/open?id=1XyZ...\n1RawDriveIdHere...`}
          rows={8}
          className="w-full font-mono text-sm bg-background/50 border border-border rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-primary resize-y min-h-[180px] text-white"
        />
        <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <div className="text-xs text-muted-foreground">
            {text.split(/\r?\n|,/).filter((l) => l.trim()).length} link(s) detected
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => { setText(""); setResults([]); }}
              disabled={loading}
              className="flex-1 sm:flex-none"
            >
              <Trash2 className="w-4 h-4 mr-1.5" /> Clear
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-primary hover:bg-primary/95 text-primary-foreground border-0 glow flex-1 sm:flex-none"
              size="lg"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Generating…</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-1.5" /> Generate Links</>
              )}
            </Button>
          </div>
        </div>
      </div>

      {results.length > 0 && (
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              Results <span className="text-muted-foreground text-sm font-normal">({results.length})</span>
            </h2>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={copyAll}>
                <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy all
              </Button>
              <Button size="sm" variant="outline" onClick={() => setResults([])}>
                Clear
              </Button>
            </div>
          </div>
          <div className="grid gap-3">
            {results.map((r) => <FileResultCard key={r.id} file={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
