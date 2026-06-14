'use client';

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <main className={cn(
      "flex-1 min-w-0",
      !isAuthPage && "pt-16 md:pt-0 pb-20 md:pb-0"
    )}>
      {children}
    </main>
  );
}
