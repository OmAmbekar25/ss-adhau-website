"use client";

import { usePathname } from "next/navigation";

/**
 * The studio page, the services register and the individual service pages
 * carry their own nav and footer — they are self-contained documents, not
 * pages inside the site chrome. This hides the global Navbar/Footer there
 * and nowhere else.
 *
 * `/services` joined the list when the register replaced the legacy page:
 * it used to be an ordinary page in the site chrome and needed the
 * children-only exception, and now the whole tree is bare.
 */
const BARE_TREE = ["/studio", "/services"];

export default function ChromeGate({ children }) {
  const pathname = usePathname();
  const bare = BARE_TREE.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  return bare ? null : children;
}
