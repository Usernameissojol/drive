'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Loader2, Mail, Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await login(formData, true);
      if (res.success) {
        toast.success('Admin authentication successful!');
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error('An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-theme min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mb-4 flex justify-start">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
      </div>
      <div className="w-full max-w-md glass-card rounded-3xl p-8 sm:p-10 glow transition-all">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl gradient-primary grid place-items-center glow mb-4">
            <ShieldAlert className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Admin Console</h1>
          <p className="text-muted-foreground text-sm mt-1">Authorized personnel only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
              <input
                name="email"
                type="email"
                placeholder="admin@gmail.com"
                required
                className="w-full bg-background/50 border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full bg-background/50 border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all text-white"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full gradient-primary text-primary-foreground border-0 glow py-6 text-base font-semibold rounded-xl transition-all"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Authenticate'}
          </Button>
        </form>
      </div>
    </div>
  );
}
