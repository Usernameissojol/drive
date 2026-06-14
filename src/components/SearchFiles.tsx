'use client';

import { useState } from "react";
import { DriveFile } from "@/types";
import { FileResultCard } from "@/components/FileResultCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { clearAllFiles } from "@/app/actions/drive";

export function SearchFiles({ initialFiles }: { initialFiles: DriveFile[] }) {
  const [q, setQ] = useState("");
  const [files, setFiles] = useState(initialFiles);

  const filtered = files.filter((f) => {
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return (
      f.filename?.toLowerCase().includes(s) ||
      f.token?.toLowerCase().includes(s) ||
      f.drive_id.toLowerCase().includes(s)
    );
  });

  const handleClearAll = async () => {
    if (!confirm("Delete all files?")) return;
    try {
      await clearAllFiles();
      setFiles([]);
      toast.success("Cleared");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="mb-6 flex gap-2">
        <input
          placeholder="Search filename, token, or Drive ID…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 bg-background/50 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-72"
        />
        <Button variant="outline" onClick={handleClearAll}>Clear all</Button>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 text-center text-muted-foreground">
          No files match your search.
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((f) => (
            <FileResultCard
              key={f.id}
              file={f}
              onDelete={(id) => setFiles((prev) => prev.filter((file) => file.id !== id))}
            />
          ))}
        </div>
      )}
    </>
  );
}
