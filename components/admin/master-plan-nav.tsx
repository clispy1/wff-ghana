"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ListChecks, UsersRound, ImageDown } from "lucide-react";

const SECTIONS = [
  { href: "/admin/master-plan", label: "OVERVIEW", icon: LayoutDashboard },
  { href: "/admin/master-plan/checklists", label: "CHECKLISTS", icon: ListChecks },
  { href: "/admin/master-plan/tasks", label: "TASK ASSIGNMENTS", icon: UsersRound },
  { href: "/admin/master-plan/designs", label: "FLYERS & DESIGN", icon: ImageDown },
];

export function MasterPlanNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4 mb-6">
      {SECTIONS.map((section) => {
        const active =
          section.href === "/admin/master-plan"
            ? pathname === "/admin/master-plan"
            : pathname.startsWith(section.href);
        const Icon = section.icon;
        return (
          <Link
            key={section.href}
            href={section.href}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-bebas tracking-widest text-sm transition-all ${
              active
                ? "bg-wff-red/10 border-wff-red/40 text-wff-red"
                : "border-white/10 text-white/50 hover:border-white/25 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" />
            {section.label}
          </Link>
        );
      })}
    </div>
  );
}
