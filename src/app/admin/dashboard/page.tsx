import pool from "@/lib/db";
import { getSession } from "@/app/actions/auth";
import { 
  Users, 
  Files, 
  AlertTriangle, 
  CheckCircle2, 
  Server, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight,
  Database,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/FileResultCard";

async function queryScalar(sql: string, params: any[] = []): Promise<number> {
  const [rows]: any = await pool.execute(sql, params);
  return rows[0]?.count || 0;
}

export default async function AdminDashboardPage() {
  const session = await getSession();

  // Query stats
  const totalUsers = await queryScalar("SELECT COUNT(*) as count FROM users");
  const totalFiles = await queryScalar("SELECT COUNT(*) as count FROM drive_files");
  const readyFiles = await queryScalar("SELECT COUNT(*) as count FROM drive_files WHERE status = 'ready'");
  const errorFiles = await queryScalar("SELECT COUNT(*) as count FROM drive_files WHERE status = 'error'");
  const processingFiles = await queryScalar("SELECT COUNT(*) as count FROM drive_files WHERE status = 'processing'");
  const totalProviders = await queryScalar("SELECT COUNT(*) as count FROM api_providers");
  const activeProviders = await queryScalar("SELECT COUNT(*) as count FROM api_providers WHERE status = 'active'");

  // Query recent system activity
  const [recentFilesRows]: any = await pool.execute(`
    SELECT df.*, u.name as user_name, u.email as user_email
    FROM drive_files df
    LEFT JOIN users u ON df.user_id = u.id
    ORDER BY df.created_at DESC
    LIMIT 10
  `);

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-primary" />
            System Console
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">System-wide monitoring, API nodes, and user control.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2">
          <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-bold text-white uppercase tracking-widest">Master Node Node-01</span>
        </div>
      </header>

      {/* Stats Summary Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 bg-white/5 border border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Users</span>
              <h2 className="text-3xl font-extrabold text-white mt-2">{totalUsers}</h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-xs text-muted-foreground flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-success" />
            <span>Active accounts</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 bg-white/5 border border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Generated Links</span>
              <h2 className="text-3xl font-extrabold text-white mt-2">{totalFiles}</h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-success/15 flex items-center justify-center text-success border border-success/25">
              <Files className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            <span className="text-success font-bold">{readyFiles}</span> ready · <span className="text-warning font-bold">{processingFiles}</span> processing
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 bg-white/5 border border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">API Failures</span>
              <h2 className="text-3xl font-extrabold text-destructive mt-2">{errorFiles}</h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-destructive/15 flex items-center justify-center text-destructive border border-destructive/25">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            Failure rate: {totalFiles > 0 ? ((errorFiles / totalFiles) * 100).toFixed(1) : 0}%
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 bg-white/5 border border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">API Clusters</span>
              <h2 className="text-3xl font-extrabold text-primary mt-2">{totalProviders}</h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
              <Server className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            Active Nodes: <span className="text-success font-bold">{activeProviders}</span> / {totalProviders}
          </div>
        </div>
      </section>

      {/* Global Activity Table */}
      <section className="glass-card rounded-3xl p-6 border border-white/5 bg-white/5 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 grid place-items-center">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">System-wide Activity</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Realtime view of recently generated files across all users.</p>
            </div>
          </div>
        </div>

        {recentFilesRows.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            No system-wide activity recorded.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider border-b border-white/5 bg-white/[0.01]">
                  <th className="px-4 py-3.5 font-bold">Filename</th>
                  <th className="px-4 py-3.5 font-bold">Owner</th>
                  <th className="px-4 py-3.5 font-bold font-mono">Size</th>
                  <th className="px-4 py-3.5 font-bold">Status</th>
                  <th className="px-4 py-3.5 font-bold text-right">Preview Landing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentFilesRows.map((f: any) => (
                  <tr key={f.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-4 max-w-[280px] truncate text-white/90 font-medium">
                      {f.filename || f.drive_id}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-white/90 font-semibold">{f.user_name || "Guest"}</span>
                        <span className="text-[10px] text-muted-foreground">{f.user_email || "N/A"}</span>
                      </div>
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
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all"
                        >
                          Landing Page <ExternalLink className="w-3.5 h-3.5" />
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
