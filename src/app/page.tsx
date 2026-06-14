import Link from "next/link";
import { Zap, ArrowRight, ShieldAlert, Sparkles, Layers, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RootPage() {
  return (
    <div className="min-h-screen bg-background text-white flex flex-col justify-between relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 grid place-items-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              DriveLink Studio
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-sm text-muted-foreground hover:text-white transition-colors">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary hover:bg-primary/95 text-primary-foreground border-0 glow text-sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 w-full relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Next-Gen Link Generator
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Unleash the Power of <br />
              <span className="bg-gradient-to-r from-primary via-sky-400 to-indigo-500 bg-clip-text text-transparent">
                Direct Downloads
              </span>
            </h1>

            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Securely convert Google Drive URLs or File IDs into instantly-downloadable links. Scale your file distribution with multi-provider failover, isolated workspaces, and deep analytics.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-primary-foreground border-0 glow py-6 px-8 text-base font-semibold rounded-xl flex items-center justify-center gap-2">
                  Create Free Account <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto border-white/10 hover:bg-white/5 py-6 px-8 text-base font-semibold rounded-xl">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Feature Grid */}
            <div className="grid sm:grid-cols-3 gap-4 pt-12 max-w-2xl mx-auto lg:mx-0">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center lg:items-start text-center lg:text-left">
                <Layers className="w-5 h-5 text-primary mb-2" />
                <h3 className="font-semibold text-sm">Batch Processing</h3>
                <p className="text-xs text-muted-foreground mt-1">Process up to 50 links simultaneously.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center lg:items-start text-center lg:text-left">
                <Globe className="w-5 h-5 text-sky-400 mb-2" />
                <h3 className="font-semibold text-sm">Multi-Provider</h3>
                <p className="text-xs text-muted-foreground mt-1">Intelligent failover for high availability.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center lg:items-start text-center lg:text-left">
                <Zap className="w-5 h-5 text-indigo-400 mb-2" />
                <h3 className="font-semibold text-sm">Instant Delivery</h3>
                <p className="text-xs text-muted-foreground mt-1">Bypass slow loading and preview screens.</p>
              </div>
            </div>
          </div>

          {/* Right Preview Card Column */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm glass-card rounded-3xl p-6 bg-white/5 border border-white/5 glow relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">drivelink_preview.tsx</span>
              </div>

              <div className="space-y-4">
                <div className="h-6 w-1/3 bg-white/10 rounded-md animate-pulse" />
                <div className="h-24 bg-background/50 border border-white/5 rounded-xl p-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="h-3 w-3/4 bg-white/5 rounded animate-pulse" />
                    <div className="h-3 w-1/2 bg-white/5 rounded animate-pulse" />
                  </div>
                  <div className="h-7 w-20 bg-primary/20 border border-primary/30 rounded-md self-end" />
                </div>

                <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold">Ready to Generate</span>
                  </div>
                  <div className="h-4 w-4 rounded bg-primary/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 bg-background/30 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 DriveLink Studio. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="flex items-center gap-1.5 hover:text-white transition-colors py-1 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all">
              <ShieldAlert className="w-3.5 h-3.5 text-primary" />
              <span>Admin Console</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
