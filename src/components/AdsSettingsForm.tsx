'use client';

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, Megaphone, Save, Globe, Code, Layers } from "lucide-react";
import { updateAdsSettings } from "@/app/actions/settings";

interface AdsSettingsFormProps {
  initialSettings: {
    ads_popunder: string;
    ads_social_bar: string;
    ads_native_banner: string;
    ads_banner_728x90: string;
    ads_direct_link: string;
  };
}

export function AdsSettingsForm({ initialSettings }: AdsSettingsFormProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateAdsSettings(settings);
      toast.success("Ads settings updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update ads settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: keyof typeof initialSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <div className="flex items-center gap-2 text-primary">
            <Globe className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Direct Ads & Redirects</span>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Adsterra Direct Link (URL)</label>
            <Input
              type="url"
              value={settings.ads_direct_link}
              onChange={(e) => handleChange("ads_direct_link", e.target.value)}
              placeholder="https://example.com/direct-link-url"
              className="bg-background/50 border-white/10"
            />
            <p className="text-[11px] text-muted-foreground">Used for direct button clicks and inline ad placements.</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Code className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Popunder Code</span>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Popunder Script</label>
            <Textarea
              value={settings.ads_popunder}
              onChange={(e) => handleChange("ads_popunder", e.target.value)}
              placeholder="<script type='text/javascript' src='//example.com/popunder.js'></script>"
              className="bg-background/50 border-white/10 h-32 font-mono text-xs"
            />
            <p className="text-[11px] text-muted-foreground">Executes a hidden click-under popup ad in the background.</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Code className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Social Bar / In-Page Push</span>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Social Bar Script</label>
            <Textarea
              value={settings.ads_social_bar}
              onChange={(e) => handleChange("ads_social_bar", e.target.value)}
              placeholder="<script type='text/javascript' src='//example.com/socialbar.js'></script>"
              className="bg-background/50 border-white/10 h-32 font-mono text-xs"
            />
            <p className="text-[11px] text-muted-foreground">Shows floating widget alerts and interactive dynamic push ads.</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Layers className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Native Banner (In-Page)</span>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Native Banner Script / HTML</label>
            <Textarea
              value={settings.ads_native_banner}
              onChange={(e) => handleChange("ads_native_banner", e.target.value)}
              placeholder="<div id='container'></div><script src='//example.com/native.js'></script>"
              className="bg-background/50 border-white/10 h-32 font-mono text-xs"
            />
            <p className="text-[11px] text-muted-foreground">Renders inline content-integrated recommendation ads.</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Layers className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Banner 728x90 (Top Page)</span>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Banner 728x90 Script / HTML</label>
            <Textarea
              value={settings.ads_banner_728x90}
              onChange={(e) => handleChange("ads_banner_728x90", e.target.value)}
              placeholder="<script src='//example.com/banner728.js'></script>"
              className="bg-background/50 border-white/10 h-32 font-mono text-xs"
            />
            <p className="text-[11px] text-muted-foreground">Standard top leaderboard banner shown below header navigation.</p>
          </div>
        </div>
      </div>
      
      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : (
          <Save className="w-4 h-4 mr-2" />
        )}
        Save Ad Settings
      </Button>
    </form>
  );
}
