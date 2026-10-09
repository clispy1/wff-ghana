"use client";

import { usePathname } from "next/navigation";
import ScrubberNavbar from "@/components/ScrubberNavbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

// Pages that keep the navbar but drop the footer. The athlete
// registration form is a focused task, and on phones the footer sat
// right under Submit and pulled athletes away from finishing.
const NO_FOOTER = ["/register"];

/**
 * The public navbar/footer/cart wrap every page from the root layout,
 * but the admin dashboard has its own chrome (AppSidebar in
 * app/admin/(dashboard)/layout.tsx) and shouldn't show the public site
 * frame around it, or on the login screen either.
 */
export default function SiteChrome({
  children,
  eventOver = false,
}: {
  children: React.ReactNode;
  eventOver?: boolean;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const hideFooter = NO_FOOTER.includes(pathname ?? "");

  // The dashboard is always dark: pin it to the dark theme tokens so the
  // public site's light/dark toggle never reaches it.
  if (isAdmin) return <div className="site-dark text-fg bg-page min-h-screen">{children}</div>;

  return (
    <>
      <ScrubberNavbar eventOver={eventOver} />
      <CartDrawer />
      {children}
      {!hideFooter && <Footer />}
    </>
  );
}
