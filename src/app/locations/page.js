import "@/app/studio.css";
import "./locations.css";
import { StudioHeader, StudioFooter } from "@/components/studio/StudioChrome";
import MapJourney from "@/components/MapJourney";

/* LOCATIONS — upgraded in place.
 *
 * The scroll-driven map, its travel animation, the card sequence and the
 * layout are the reverted build's, unchanged. What changed here is the
 * shell: the page carries `.er` so it can use the site's tokens, and the
 * chrome is StudioChrome's nav and R-5 footer rather than the legacy
 * Navbar/Footer — the same chrome every other document route on this site
 * now uses. `ChromeGate` keeps the global pair off this path.
 */

export const metadata = {
  title: "Locations — S S Adhau Valuers & Engineers",
  description:
    "S S Adhau Valuers & Engineers serves nine cities across Madhya Pradesh and Maharashtra — offices in Nagpur and Chhindwara, with site inspections conducted on location in Betul, Seoni, Balaghat, Jabalpur, Bhopal, Indore and Pandhurna.",
  alternates: { canonical: "/locations" },
};

export default function LocationsPage() {
  return (
    <div className="er er-loc">
      <a className="er-skip" href="#er-main">
        Skip to content
      </a>

      <StudioHeader />

      <main id="er-main" className="min-h-screen">
        <div className="er-loc__hero">
          <div className="mx-auto max-w-7xl px-6 pb-4 md:px-10">
            <p className="er-label er-loc__eyebrow">Areas we serve</p>
            {/* the serif's one string on this page */}
            <h1 className="er-loc__h1">
              From our offices to your site, wherever it is.
            </h1>
            <p className="er-loc__sub">
              Scroll to travel the network: two offices, nine cities, and
              every valuation begun with a physical site inspection.
            </p>
          </div>
        </div>

        <MapJourney />
      </main>

      <StudioFooter />
    </div>
  );
}
