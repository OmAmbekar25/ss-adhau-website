"use client";

import { usePathname } from "next/navigation";

/**
 * The studio page and the service pages carry their own nav and footer —
 * they are self-contained documents, not pages inside the site chrome.
 * This hides the global Navbar/Footer there and nowhere else.
 *
 * `/studio` bares itself and anything under it. `/services` does NOT: the
 * index is still an ordinary page in the site chrome, and only the
 * individual service documents beneath it are bare. Hence two rules rather
 * than one prefix test.
 */
const BARE_TREE = ["/studio"];
const BARE_CHILDREN_ONLY = ["/services"];

export default function ChromeGate({ children }) {
  const pathname = usePathname();
  const bare =
    BARE_TREE.some((p) => pathname === p || pathname.startsWith(`${p}/`)) ||
    BARE_CHILDREN_ONLY.some((p) => pathname.startsWith(`${p}/`));
  return bare ? null : children;
}
