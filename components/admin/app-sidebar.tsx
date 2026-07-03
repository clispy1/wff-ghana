"use client";

import { Home, Users, Calendar, ShoppingBag, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const items = [
  { title: "Dashboard", url: "/admin", icon: Home },
  { title: "Events & Logistics", url: "/admin/events", icon: Calendar },
  { title: "Athletes Roster", url: "/admin/athletes", icon: Users },
  { title: "Armory Shop", url: "/admin/shop", icon: ShoppingBag },
  { title: "System Settings", url: "/admin/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <Sidebar className="bg-black border-r border-white/10" variant="sidebar" collapsible="icon">
      <SidebarHeader className="bg-[#050505] p-4 border-b border-white/10">
        <h2 className="font-bebas text-3xl tracking-widest text-white">WFF <span className="text-wff-red">ADMIN</span></h2>
      </SidebarHeader>
      <SidebarContent className="bg-[#0A0A0A]">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/40 uppercase tracking-widest font-sans font-bold text-[10px] my-2">Management Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={`hover:bg-wff-red/10 hover:text-wff-red transition-all ${isActive ? 'bg-wff-red/10 text-wff-red border-r-2 border-wff-red' : 'text-white/60'}`}
                      tooltip={item.title}
                    >
                      <Link href={item.url} className="flex items-center">
                        <item.icon className="h-5 w-5 mr-2" />
                        <span className="font-sans font-bold text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-[#050505] border-t border-white/10">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-white/40 hover:text-wff-red hover:bg-wff-red/10">
              <LogOut className="h-4 w-4 mr-2" />
              <span className="font-sans text-xs">Terminate Session</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
