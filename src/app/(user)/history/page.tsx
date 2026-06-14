import { getFiles } from "@/app/actions/drive";
import { format } from "date-fns";
import { DeleteFileButton } from "@/components/DeleteFileButton";

export default async function HistoryPage() {
  const files = await getFiles(100);

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-5xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">History</h1>
        <p className="text-muted-foreground mt-1 text-sm">Recently processed files and status updates.</p>
      </header>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Filename</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((f) => (
              <tr key={f.id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                  {format(new Date(f.created_at), "MMM d, p")}
                </td>
                <td className="px-6 py-4 font-medium">{f.filename || f.drive_id}</td>
                <td className="px-6 py-4">
                   <span className={`capitalize ${f.status === 'ready' ? 'text-success' : f.status === 'error' ? 'text-destructive' : 'text-warning'}`}>
                     {f.status}
                   </span>
                </td>
                <td className="px-6 py-4 text-right">
                   <DeleteFileButton id={f.id} filename={f.filename || f.drive_id} />
                </td>
              </tr>
            ))}
            {files.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">No history found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
