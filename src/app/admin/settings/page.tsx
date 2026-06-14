import { HardDrive, Shield, Zap, Lock, UserCog, Cloud, Megaphone } from "lucide-react";
import { getProviders, getSetting } from "@/app/actions/settings";
import { ProvidersManager } from "@/components/ProvidersManager";
import { PasswordChangeForm } from "@/components/PasswordChangeForm";
import { ProfileSettingsForm } from "@/components/ProfileSettingsForm";
import { AdsSettingsForm } from "@/components/AdsSettingsForm";
import { getSession } from "@/app/actions/auth";
import { getUserProfile } from "@/app/actions/user";

export default async function AdminSettingsPage() {
  const session = await getSession();
  const profile = await getUserProfile();
  const providers = await getProviders();

  const adsPopunder = await getSetting("ads_popunder") || "";
  const adsSocialBar = await getSetting("ads_social_bar") || "";
  const adsNativeBanner = await getSetting("ads_native_banner") || "";
  const adsBanner728x90 = await getSetting("ads_banner_728x90") || "";
  const adsDirectLink = await getSetting("ads_direct_link") || "";

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-5xl mx-auto animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">System Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage profile, API provider keys, database state, and cluster preferences.</p>
      </header>

      <div className="grid gap-8">
        <section className="glass-card rounded-2xl p-6 border-white/5 bg-white/5 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 grid place-items-center">
              <UserCog className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Admin Profile</h2>
              <p className="text-xs text-muted-foreground">Update administrator personal information</p>
            </div>
          </div>
          
          <ProfileSettingsForm 
            initialName={profile?.name || session?.name || "Admin"} 
            initialAvatar={profile?.avatar_url}
          />
        </section>

        <section className="glass-card rounded-2xl p-6 border-primary/10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Cloud className="w-32 h-32 text-primary" />
          </div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 grid place-items-center">
              <Cloud className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Multi-API Provider Clusters</h2>
              <p className="text-xs text-muted-foreground">Add multiple DriveCloud keys to bypass limits and ensure uptime</p>
            </div>
          </div>
          
          <ProvidersManager initialProviders={providers} />
        </section>

        <section className="glass-card rounded-2xl p-6 border-white/5 bg-white/5 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 grid place-items-center">
              <Megaphone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Adsterra Advertisement Manager</h2>
              <p className="text-xs text-muted-foreground">Manage HTML script codes and direct ad URLs shown on the Download Page.</p>
            </div>
          </div>
          
          <AdsSettingsForm 
            initialSettings={{
              ads_popunder: adsPopunder,
              ads_social_bar: adsSocialBar,
              ads_native_banner: adsNativeBanner,
              ads_banner_728x90: adsBanner728x90,
              ads_direct_link: adsDirectLink
            }}
          />
        </section>
        
        <section className="glass-card rounded-2xl p-6 border-border/40">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 grid place-items-center">
              <Lock className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Admin Security</h2>
              <p className="text-xs text-muted-foreground">Change your administrator console password</p>
            </div>
          </div>
          
          <PasswordChangeForm />
        </section>

        <section className="glass-card rounded-2xl p-6 border-border/40">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 grid place-items-center">
              <HardDrive className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Database Status</h2>
              <p className="text-xs text-muted-foreground">Local storage configuration</p>
            </div>
          </div>
          
          <div className="space-y-2 text-sm max-w-md">
            <div className="flex justify-between py-3 border-b border-border/50">
              <span className="text-muted-foreground">Database Engine</span>
              <span className="font-medium">MySQL 8.0+</span>
            </div>
            <div className="flex justify-between py-3 border-b border-border/50">
              <span className="text-muted-foreground">Current Host</span>
              <span className="font-medium text-primary">{process.env.MYSQL_HOST || 'localhost'}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-muted-foreground">Connection Status</span>
              <span className="flex items-center gap-1.5 text-success font-medium">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                Active
              </span>
            </div>
          </div>
        </section>

        <section className="glass-card rounded-2xl p-6 opacity-60 border-border/40 bg-muted/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-muted grid place-items-center">
              <Shield className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Security & Access</h2>
              <p className="text-xs text-muted-foreground">Advanced access controls</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground bg-muted/20 p-4 rounded-xl border border-dashed border-border/60">
            Multi-factor authentication and role-based permissions are planned for version 1.1.
          </p>
        </section>
      </div>
    </div>
  );
}
