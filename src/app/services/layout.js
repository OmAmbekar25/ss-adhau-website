import { newsreader } from "@/app/fonts/newsreader";

/* The routes under /services read, so they preload the reading face and
   never shift. Every other route never hears of it. See the font module
   for why it is declared there rather than here. */
export default function ServicesLayout({ children }) {
  return <div className={newsreader.variable}>{children}</div>;
}
