"use client";

import { usePathname } from "next/navigation";

/**
 * The home page, the services register and the individual service pages
 * carry their own nav and footer — they are self-contained documents, not
 * pages inside the site chrome. This hides the global Navbar/Footer there
 * and nowhere else.
 *
 * `/services` joined the list when the register replaced the legacy page.
 * `/` joined it when the studio page was promoted to the home page and the
 * legacy home was deleted — the entry it replaces is `/studio`, which no
 * longer exists as a route. `/locations` joined when the upgrade pass put
 * StudioChrome's nav and R-5 footer on it in place of the global pair.
 *
 * The root is matched EXACTLY and is deliberately not run through the
 * prefix test below: every path on the site starts with "/", so a prefix
 * match on the root would strip the chrome from every page on it.
 */
const BARE_EXACT = ["/", "/locations", "/about"];
const BARE_TREE = ["/services"];

export default function ChromeGate({ children }) {
  const pathname = usePathname();
  const bare =
    BARE_EXACT.includes(pathname) ||
    BARE_TREE.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  return bare ? null : children;
}
