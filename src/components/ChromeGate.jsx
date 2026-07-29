"use client";

import { usePathname } from "next/navigation";

/**
 * The studio page carries its own nav and footer — it is a single
 * self-contained document, not a page inside the site chrome. This hides
 * the global Navbar/Footer there and nowhere else.
 */
const BARE = ["/studio"];

export default function ChromeGate({ children }) {
  const pathname = usePathname();
  if (BARE.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null;
  }
  return children;
}
