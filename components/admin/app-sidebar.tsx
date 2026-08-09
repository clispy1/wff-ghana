"use client";

import { useEffect, useState } from "react";
import {
  Home,
  Users,
  Calendar,
  ShoppingBag,
  Settings,
  LogOut,
  ClipboardList,
  Ticket,
  Receipt,
  Newspaper,
  Handshake,
  UserSquare,
  Mail,
  LayoutTemplate,
  CalendarClock,
  Hotel,
  Images,
  Store,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface NavGroup {
  title: string;
  icon: LucideIcon;
  items: NavItem[];
}

const topLevelItem: NavItem = { title: "Dashboard", url: "/admin", icon: Home };

const navGroups: NavGroup[] = [
  {
    title: "Content",
    icon: LayoutTemplate,
    items: [
      { title: "Homepage Content", url: "/admin/homepage", icon: LayoutTemplate },
      { title: "Gallery", url: "/admin/gallery", icon: Images },
      { title: "News & Media", url: "/admin/news", icon: Newspaper },
    ],
  },
  {
    title: "Championship Event",
    icon: Calendar,
    items: [
      { title: "Events & Logistics", url: "/admin/events", icon: Calendar },
      { title: "Event Schedule", url: "/admin/schedule", icon: CalendarClock },
      { title: "Accommodations", url: "/admin/accommodations", icon: Hotel },
      { title: "Ticket Tiers", url: "/admin/tickets", icon: Ticket },
      { title: "Athlete Registrations", url: "/admin/registrations", icon: ClipboardList },
      { title: "Athletes Roster", url: "/admin/athletes", icon: Users },
    ],
  },
  {
    title: "Commerce",
    icon: ShoppingBag,
    items: [
      { title: "Armory Shop", url: "/admin/shop", icon: ShoppingBag },
      { title: "Orders", url: "/admin/orders", icon: Receipt },
      { title: "Event Vendors", url: "/admin/vendors", icon: Store },
      { title: "Vendor Packages", url: "/admin/vendor-packages", icon: Store },
    ],
  },
  {
    title: "Federation",
    icon: Handshake,
    items: [
      { title: "Sponsors", url: "/admin/sponsors", icon: Handshake },
      { title: "Federation Staff", url: "/admin/staff", icon: UserSquare },
    ],
  },
  {
    title: "System",
    icon: Settings,
    items: [
      { title: "Inbox", url: "/admin/messages", icon: Mail },
      { title: "System Settings", url: "/admin/settings", icon: Settings },
    ],
  },
  {
    title: "Event Master Plan",
    icon: Calendar,
    items: [
      { title: "Master Plan", url: "/admin/master-plan", icon: Calendar },
      { title: "Checklists", url: "/admin/master-plan/checklists", icon: ClipboardList },
      { title: "Task Assignments", url: "/admin/master-plan/tasks", icon: ClipboardList },
      { title: "Flyers & Design", url: "/admin/master-plan/designs", icon: Images },
    ],
  },
];

function groupContaining(pathname: string): string | undefined {
  return navGroups.find((g) => g.items.some((i) => i.url === pathname))?.title;
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // Whichever group holds the current page starts open; toggling never
  // closes a group the user is actively inside, only ones they collapse
  // themselves.
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => {
    const active = groupContaining(pathname);
    return new Set(active ? [active] : []);
  });

  useEffect(() => {
    const active = groupContaining(pathname);
    if (active) {
      setOpenGroups((prev) => (prev.has(active) ? prev : new Set(prev).add(active)));
    }
  }, [pathname]);

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

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
              {/* Dashboard: always visible, not nested under a group */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href={topLevelItem.url} className="flex items-center" />}
                  isActive={pathname === topLevelItem.url}
                  className={`hover:bg-wff-red/10 hover:text-wff-red transition-all ${pathname === topLevelItem.url ? 'bg-wff-red/10 text-wff-red border-r-2 border-wff-red' : 'text-white/60'}`}
                  tooltip={topLevelItem.title}
                >
                  <topLevelItem.icon className="h-5 w-5 mr-2" />
                  <span className="font-sans font-bold text-sm">{topLevelItem.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {navGroups.map((group) => {
                const isOpen = openGroups.has(group.title);
                const hasActiveChild = group.items.some((i) => i.url === pathname);

                return (
                  <SidebarMenuItem key={group.title}>
                    <SidebarMenuButton
                      onClick={() => toggleGroup(group.title)}
                      className={`hover:bg-white/5 transition-all ${hasActiveChild ? 'text-wff-gold' : 'text-white/60'}`}
                      tooltip={group.title}
                    >
                      <group.icon className="h-5 w-5 mr-2" />
                      <span className="font-sans font-bold text-sm flex-1">{group.title}</span>
                      <ChevronRight
                        className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                      />
                    </SidebarMenuButton>

                    {isOpen && (
                      <SidebarMenuSub>
                        {group.items.map((item) => {
                          const isActive = pathname === item.url;
                          return (
                            <SidebarMenuSubItem key={item.title}>
                              <SidebarMenuSubButton
                                render={<Link href={item.url} className="flex items-center" />}
                                isActive={isActive}
                                className={`hover:bg-wff-red/10 hover:text-wff-red transition-all ${isActive ? 'bg-wff-red/10 text-wff-red' : 'text-white/50'}`}
                              >
                                <item.icon className="h-4 w-4 mr-2" />
                                <span className="font-sans text-xs font-bold">{item.title}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    )}
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
