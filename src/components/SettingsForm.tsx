'use client';

import { useState } from "react";
import { updateSetting } from "@/app/actions/settings";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Save } from "lucide-react";

export function SettingsForm({ initialApiKey }: { initialApiKey: string }) {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateSetting('api_key', apiKey);
      toast.success("Settings updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">API Token</label>
        <div className="mt-1.5 flex flex-col sm:flex-row gap-2">
          <Input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="flex-1 font-mono"
            placeholder="Enter your API token..."
            required
          />
          <Button type="submit" disabled={loading} className="shrink-0">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground italic">
          Tip: This token is stored in your database and used for all link generation requests.
        </p>
      </div>
    </form>
  );
}
