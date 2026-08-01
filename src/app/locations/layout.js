import { newsreader } from "@/app/fonts/newsreader";

/* /locations reads too: the hero sub-line and every card body on the page
   are set in the reading face. Without this the segment renders them in
   the mono. */
export default function LocationsLayout({ children }) {
  return <div className={newsreader.variable}>{children}</div>;
}
