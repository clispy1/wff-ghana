"use client";

import { usePathname } from "next/navigation";
import ScrubberNavbar from "@/components/ScrubberNavbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

/**
 * The public navbar/footer/cart wrap every page from the root layout,
 * but the admin dashboard has its own chrome (AppSidebar in
 * app/admin/(dashboard)/layout.tsx) and shouldn't show the public site
 * frame around it, or on the login screen either.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <ScrubberNavbar />
      <CartDrawer />
      {children}
      <Footer />
    </>
  );
}
