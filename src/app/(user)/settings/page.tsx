import { Lock, UserCog } from "lucide-react";
import { PasswordChangeForm } from "@/components/PasswordChangeForm";
import { ProfileSettingsForm } from "@/components/ProfileSettingsForm";
import { getSession } from "@/app/actions/auth";
import { getUserProfile } from "@/app/actions/user";

export default async function UserSettingsPage() {
  const session = await getSession();
  const profile = await getUserProfile();

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-5xl mx-auto animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage your profile and account preferences.</p>
      </header>

      <div className="grid gap-8">
        <section className="glass-card rounded-2xl p-6 border-white/5 bg-white/5 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 grid place-items-center">
              <UserCog className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Profile Settings</h2>
              <p className="text-xs text-muted-foreground">Update your personal profile information</p>
            </div>
          </div>
          
          <ProfileSettingsForm 
            initialName={profile?.name || session?.name || "User"} 
            initialAvatar={profile?.avatar_url}
          />
        </section>

        <section className="glass-card rounded-2xl p-6 border-border/40">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 grid place-items-center">
              <Lock className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Account Security</h2>
              <p className="text-xs text-muted-foreground">Change your password</p>
            </div>
          </div>
          
          <PasswordChangeForm />
        </section>
      </div>
    </div>
  );
}
