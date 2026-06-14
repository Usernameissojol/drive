'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Files,
  History,
  Settings,
  Zap,
  LogOut,
  Menu,
  X,
  Code2,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/actions/auth";
import { toast } from "sonner";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Add File", url: "/add", icon: PlusCircle },
  { title: "Files", url: "/files", icon: Files },
  { title: "History", url: "/history", icon: History },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "API Docs", url: "/api-docs", icon: Code2 },
];

export function UserSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const isLight = document.documentElement.classList.contains('light') || localStorage.getItem('theme') === 'light';
    if (isLight) {
      setTheme('light');
      document.documentElement.classList.add('light');
    } else {
      setTheme('dark');
      document.documentElement.classList.remove('light');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
      toast.success("Switched to Light Mode");
    } else {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
      toast.success("Switched to Dark Mode");
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 z-40 bg-sidebar/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary grid place-items-center glow">
            <Zap className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-sm">DriveLink Studio</span>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-background/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside className={cn(
        "md:hidden fixed top-0 left-0 bottom-0 w-72 z-50 bg-sidebar border-r border-border transform transition-transform duration-300 ease-in-out flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary grid place-items-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="font-semibold text-sm">DriveLink</div>
          </div>
          <button onClick={() => setIsOpen(false)}>
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {items.map((it) => {
            const active = pathname === it.url;
            return (
              <Link
                key={it.url}
                href={it.url}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                  active
                    ? "gradient-primary text-primary-foreground glow font-medium"
                    : "text-sidebar-foreground/80 hover:bg-white/5 hover:text-sidebar-foreground"
                )}
              >
                <it.icon className="w-4 h-4" />
                <span>{it.title}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border flex items-center justify-around">
          <Link
            href="/settings"
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl text-sidebar-foreground/80 hover:bg-white/5 hover:text-sidebar-foreground transition-all"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </Link>
          <button
            onClick={() => { toggleTheme(); setIsOpen(false); }}
            className="p-2 rounded-xl text-sidebar-foreground/80 hover:bg-white/5 hover:text-sidebar-foreground transition-all"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-destructive hover:bg-destructive/10 transition-all"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden md:flex sticky top-0 h-screen w-64 flex-col border-r border-border bg-sidebar/80 backdrop-blur-xl">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
          <div className="w-9 h-9 rounded-xl gradient-primary grid place-items-center glow">
            <Zap className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-sidebar-foreground">DriveLink</div>
            <div className="text-xs text-muted-foreground">User Portal</div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {items.map((it) => {
            const active = pathname === it.url;
            return (
              <Link
                key={it.url}
                href={it.url}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                  active
                    ? "gradient-primary text-primary-foreground glow font-medium"
                    : "text-sidebar-foreground/80 hover:bg-white/5 hover:text-sidebar-foreground"
                )}
              >
                <it.icon className="w-4 h-4" />
                <span>{it.title}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 mt-auto border-t border-border flex items-center justify-around">
          <Link
            href="/settings"
            className="p-2 rounded-xl text-sidebar-foreground/80 hover:bg-white/5 hover:text-sidebar-foreground transition-all"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </Link>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-sidebar-foreground/80 hover:bg-white/5 hover:text-sidebar-foreground transition-all"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-destructive hover:bg-destructive/10 transition-all"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        <div className="p-3 text-center text-[10px] text-muted-foreground border-t border-border">
          v1.0 · Standard Member
        </div>
      </aside>

      {/* Mobile Bottom Navigation (Permanent) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-sidebar/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-6">
          {items.map((it) => {
            const active = pathname === it.url;
            return (
              <Link
                key={it.url}
                href={it.url}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 text-[10px]",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <it.icon className="w-5 h-5" />
                <span className="truncate w-full text-center px-1">{it.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Padding for mobile content to avoid being hidden by header/footer */}
      <div className="md:hidden h-16" /> 
    </>
  );
}
