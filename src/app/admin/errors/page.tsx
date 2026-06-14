import pool from "@/lib/db";
import { format } from "date-fns";
import { AlertCircle, Calendar, User, Database } from "lucide-react";

export default async function AdminErrorsPage() {
  // Query all system error logs
  const [logs]: any = await pool.execute(`
    SELECT el.*, u.name as user_name, u.email as user_email
    FROM error_logs el
    LEFT JOIN users u ON el.user_id = u.id
    ORDER BY el.created_at DESC
    LIMIT 100
  `);

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="mb-6">
        <h1 className="text-3xl font-black text-destructive flex items-center gap-3">
          <AlertCircle className="w-8 h-8" />
          System Error Logs
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">Monitor program errors, failed DriveCloud API calls, and bad queries.</p>
      </header>

      {logs.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 text-center text-muted-foreground">
          No errors recorded in the system.
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log: any) => (
            <div key={log.id} className="glass-card rounded-2xl p-5 border-destructive/20 bg-[#160b0c]/10">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-destructive text-base">{log.message}</h3>
                  <div className="text-xs text-muted-foreground mt-2 flex flex-wrap gap-4 items-center">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {format(new Date(log.created_at), "PPP p")}
                    </span>
                    <span className="opacity-50">•</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Database className="w-3.5 h-3.5" />
                      Drive ID: {log.drive_id || "N/A"}
                    </span>
                    <span className="opacity-50">•</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      User: {log.user_name || "Guest"} ({log.user_email || "N/A"})
                    </span>
                  </div>
                </div>
              </div>
              {log.details && (
                <pre className="mt-4 p-4 rounded-xl bg-background/60 text-[11px] font-mono overflow-x-auto text-muted-foreground border border-white/5 max-h-60">
                  {JSON.stringify(log.details, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
