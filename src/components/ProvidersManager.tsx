'use client';

import { useState } from "react";
import { addProvider, deleteProvider, toggleProviderStatus } from "@/app/actions/settings";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Trash2, Power, PowerOff, Globe, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ProvidersManager({ initialProviders }: { initialProviders: any[] }) {
  const [providers, setProviders] = useState(initialProviders);
  const [newName, setNewName] = useState("");
  const [newApiKey, setNewApiKey] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newApiKey) return;
    
    setLoading(true);
    try {
      await addProvider(newName, newApiKey);
      toast.success("Provider added successfully");
      setNewName("");
      setNewApiKey("");
      // Ideally we should refresh the list, but since it's a server action with revalidatePath,
      // a simple page refresh or state update would work. For simplicity, we can reload.
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Failed to add provider");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this provider?")) return;
    
    try {
      await deleteProvider(id);
      toast.success("Provider deleted");
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete provider");
    }
  };

  const handleToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await toggleProviderStatus(id, newStatus);
      toast.success(`Provider ${newStatus}`);
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  return (
    <div className="space-y-8">
      {/* Add Provider Form */}
      <form onSubmit={handleAdd} className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Plus className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Add New Provider</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">Server Name</label>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Fast Server 01"
              className="bg-background/50 border-white/10"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">API Token</label>
            <Input
              value={newApiKey}
              onChange={(e) => setNewApiKey(e.target.value)}
              placeholder="Enter API Key"
              className="bg-background/50 border-white/10 font-mono"
              required
            />
          </div>
        </div>
        <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground font-bold border-0 glow">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          Register API Provider
        </Button>
      </form>

      {/* Provider List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Active Nodes</h3>
          <Badge variant="outline" className="text-[10px] border-white/10">{providers.length} Registered</Badge>
        </div>
        
        <div className="grid gap-3">
          {providers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm italic">
              No providers configured. Please add one to start generating links.
            </div>
          ) : (
            providers.map((p) => (
              <div key={p.id} className="group relative flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl grid place-items-center ${p.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted/10 text-muted-foreground'}`}>
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{p.name}</span>
                      {p.status === 'active' ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                      ) : null}
                    </div>
                    <div className="text-xs font-mono text-muted-foreground truncate max-w-[150px] sm:max-w-xs">
                      {p.api_key.substring(0, 8)}••••••••••••••••
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(p.id, p.status)}
                    className={`p-2 rounded-lg transition-colors ${p.status === 'active' ? 'text-success hover:bg-success/10' : 'text-muted-foreground hover:bg-white/10'}`}
                    title={p.status === 'active' ? 'Deactivate' : 'Activate'}
                  >
                    {p.status === 'active' ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
