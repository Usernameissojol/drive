'use client';

import { useState } from "react";
import Link from "next/link";
import { Files, AlertTriangle, CheckCircle2, Loader2, ArrowRight, Search, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/FileResultCard";
import { DriveFile } from "@/types";

function StatCard({
  label, value, icon: Icon, accent,
}: { label: string; value: string | number; icon: any; accent: string }) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-white/5 bg-white/5 backdrop-blur-lg">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
        </div>
        <div className={`w-10 h-10 rounded-xl grid place-items-center ${accent}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

export function DashboardContent({ 
  initialFiles, 
  userName 
}: { 
  initialFiles: DriveFile[], 
  userName: string 
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFiles = initialFiles.filter((f) => {
    const query = searchQuery.toLowerCase();
    return (
      f.filename?.toLowerCase().includes(query) ||
      f.token?.toLowerCase().includes(query) ||
      f.drive_id?.toLowerCase().includes(query) ||
      f.download_url?.toLowerCase().includes(query)
    );
  });

  const total = filteredFiles.length;
  const ready = filteredFiles.filter((f) => f.status === "ready").length;
  const errors = filteredFiles.filter((f) => f.status === "error").length;
  const processing = filteredFiles.filter((f) => f.status === "processing").length;
  const recent = filteredFiles.slice(0, 10);

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="relative flex-1 sm:hidden">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-white/5 border-white/10 rounded-xl"
          />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground">Manage your Drive links and monitor performance</p>
        </div>
        <Button asChild className="h-11 px-6 gradient-primary text-primary-foreground border-0 glow rounded-xl font-semibold">
          <Link href="/add">
            Add New File <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total Files" value={total} icon={Files} accent="bg-primary/20 text-primary border border-primary/20" />
        <StatCard label="Ready" value={ready} icon={CheckCircle2} accent="bg-success/20 text-success border border-success/20" />
        <StatCard label="Processing" value={processing} icon={Loader2} accent="bg-warning/20 text-warning border border-warning/20" />
        <StatCard label="Errors" value={errors} icon={AlertTriangle} accent="bg-destructive/20 text-destructive border border-destructive/20" />
      </section>

      {/* Recent Activity Table */}
      <section className="glass-card rounded-3xl p-6 border border-white/5 bg-white/5 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 grid place-items-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          </div>
          <Link href="/files" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
            View All Files <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-16 h-16 rounded-full bg-muted/20 grid place-items-center mx-auto opacity-50">
              <Files className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No matching files found.</p>
            <Link href="/add" className="text-primary hover:underline text-sm font-medium">Generate your first link</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider border-b border-white/5">
                  <th className="px-4 py-3 font-semibold">File Name / ID</th>
                  <th className="px-4 py-3 font-semibold">File Size</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recent.map((f) => (
                  <tr key={f.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-4 max-w-[250px] truncate text-white/90 group-hover:text-white transition-colors">
                      {f.filename || f.drive_id}
                    </td>
                    <td className="px-4 py-4 text-muted-foreground font-mono text-xs">
                      {f.filesize || "—"}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={f.status} />
                    </td>
                    <td className="px-4 py-4 text-right">
                      {f.download_url ? (
                        <Link 
                          href={f.download_url} 
                          target="_blank" 
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all"
                        >
                          Download
                        </Link>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
