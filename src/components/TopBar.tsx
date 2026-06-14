'use client';

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Search, User, Bell, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NotificationPanel } from "./NotificationPanel";

export function TopBar({ 
  session, 
  profile,
  initialNotifications = []
}: { 
  session: any;
  profile?: any;
  initialNotifications?: any[];
}) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  
  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  // Only show search on dashboard for now
  const showSearch = pathname === "/";

  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl hidden md:block">
      <div className="flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-4 flex-1">
          {showSearch && (
            <div className="relative w-full max-w-md hidden sm:block group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search files..."
                className="pl-10 h-10 bg-white/5 border-white/10 rounded-xl focus:border-primary/50 transition-all"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-xl transition-all relative ${showNotifications ? 'bg-primary/10 text-primary' : 'hover:bg-white/5 text-muted-foreground hover:text-primary'}`}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full border-2 border-background grid place-items-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <NotificationPanel 
                notifications={notifications} 
                onClose={() => setShowNotifications(false)} 
              />
            )}
          </div>
          
          <div className="h-8 w-px bg-white/10 mx-2" />
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-white leading-none">{profile?.name || session?.name || "User"}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-tighter mt-1">
                {session?.role || "Member"}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 grid place-items-center overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-primary" />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
