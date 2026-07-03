"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen bg-[#070707] flex items-center justify-center text-wff-gold font-bebas text-2xl">INITIALIZING SECURE LINK...</div>;
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 overflow-x-hidden min-h-screen bg-[#070707] text-white">
          <div className="p-4 border-b border-white/10 flex items-center bg-black">
            <SidebarTrigger className="text-white hover:text-wff-red transition-colors" />
            <h1 className="ml-4 font-bebas text-2xl tracking-widest text-wff-gold">WFF COMMAND CENTER</h1>
          </div>
          <div className="p-6 md:p-10">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  );
}
