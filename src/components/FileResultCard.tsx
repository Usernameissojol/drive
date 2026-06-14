'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, FileVideo, AlertCircle, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DriveFile } from "@/types";
import { deleteFile } from "@/app/actions/drive";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export function FileResultCard({ file, onDelete }: { file: DriveFile; onDelete?: (id: string) => void }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const status = file.status;
  const ready = status === "ready" && !!file.download_url;

  const copy = async (val: string, label: string) => {
    try {
      await navigator.clipboard.writeText(val);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Copy failed");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteFile(file.id);
      toast.success("File deleted");
      onDelete?.(file.id);
    } catch (error: any) {
      toast.error(error.message || "Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 transition-all hover:border-primary/40">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 grid place-items-center shrink-0">
          {status === "error" ? (
            <AlertCircle className="w-5 h-5 text-destructive" />
          ) : status === "processing" ? (
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          ) : (
            <FileVideo className="w-5 h-5 text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="min-w-0 flex-1">
              <div className="font-medium truncate text-foreground">
                {file.filename || file.drive_id}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
                {file.filesize && <span>{file.filesize}</span>}
                <span className="opacity-50">·</span>
                <span className="font-mono truncate">{file.drive_id}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={status} />
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete <span className="font-medium text-foreground">{file.filename || file.drive_id}</span>.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {ready ? (
            <>
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-background/50 border border-border px-3 py-2">
                <span className="text-xs text-muted-foreground shrink-0">Token:</span>
                <code className="text-xs font-mono truncate flex-1">{file.token}</code>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="default"
                  className="gradient-primary text-primary-foreground border-0"
                  onClick={() => copy(`${window.location.origin}${file.download_url}`, "Download URL")}
                >
                  <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Link
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => copy(file.token!, "Token")}
                >
                  <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Token
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href={file.download_url!} target="_blank">
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Open
                  </Link>
                </Button>
              </div>
            </>
          ) : status === "error" ? (
            <div className="mt-3 text-sm text-destructive">
              {file.error_message || "Failed to generate link"}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  if (status === "ready")
    return (
      <Badge className="bg-success/15 text-success border-success/30 hover:bg-success/15">
        Ready
      </Badge>
    );
  if (status === "error")
    return (
      <Badge className="bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/15">
        Error
      </Badge>
    );
  return (
    <Badge className="bg-warning/15 text-warning border-warning/30 hover:bg-warning/15">
      Processing
    </Badge>
  );
}
