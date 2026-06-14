'use client';

import { useState } from "react";
import { Bell, Check, Info, AlertTriangle, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { markAsRead, markAllAsRead } from "@/app/actions/notifications";
import { formatDistanceToNow } from "date-fns";

export function NotificationPanel({ 
  notifications, 
  onClose 
}: { 
  notifications: any[], 
  onClose: () => void 
}) {
  const unreadCount = notifications.filter(n => !n.is_read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <Check className="w-4 h-4 text-success" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-warning" />;
      default: return <Info className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-[#09090b] rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] border border-white/10 animate-in fade-in slide-in-from-top-2 duration-200 z-50 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-md bg-primary/20 text-primary text-[10px] font-bold">
              {unreadCount} NEW
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button 
              onClick={() => markAllAsRead()}
              className="p-1.5 rounded-lg hover:bg-white/5 text-xs text-muted-foreground hover:text-white transition-colors"
              title="Mark all as read"
            >
              <Check className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
        {notifications.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-muted/20 grid place-items-center mx-auto opacity-50">
              <Bell className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">All caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                className={cn(
                  "p-4 transition-colors group relative",
                  !n.is_read ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-white/[0.02]"
                )}
              >
                <div className="flex gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg grid place-items-center shrink-0",
                    n.type === 'success' ? "bg-success/10" : 
                    n.type === 'error' ? "bg-destructive/10" : 
                    "bg-primary/10"
                  )}>
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("text-sm font-semibold truncate", n.is_read ? "text-white/80" : "text-white")}>
                        {n.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap mt-0.5">
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    {n.message && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>}
                  </div>
                </div>
                {!n.is_read && (
                  <button 
                    onClick={() => markAsRead(n.id)}
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded bg-background shadow-sm border border-white/5 hover:text-primary"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-white/5 bg-white/5 text-center">
        <button className="text-xs font-semibold text-primary hover:underline">
          View all notifications
        </button>
      </div>
    </div>
  );
}
