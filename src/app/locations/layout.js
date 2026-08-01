import { newsreader } from "@/app/fonts/newsreader";

/* /locations reads too: the hero intro carries the reading fill and every
   card in the deck sets its body and address in the reading face. Without
   this the segment silently rendered all of them in the mono. */
export default function LocationsLayout({ children }) {
  return <div className={newsreader.variable}>{children}</div>;
}
