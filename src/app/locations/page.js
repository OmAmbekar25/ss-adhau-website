import "@/app/studio.css";
import "./locations.css";
import {
  StudioHeader,
  StudioFooter,
  PHONE,
  PHONE_HREF,
} from "@/components/studio/StudioChrome";
import ServiceMotion from "@/components/services/ServiceMotion";
import ReadingText from "@/components/services/ReadingText";
import Territory from "@/components/locations/Territory";
import { CITIES } from "@/data/territory";

/* THE TERRITORY — /locations.
 *
 * This REPLACES the previous page rather than restyling it. Gone with it:
 * the three.js map journey (`MapJourney` + `lib/map3d.js`), the serpentine
 * metro diagram in `OurPresence`, and the Tailwind-classed hero. No canvas
 * on this route — the map is an SVG of two state outlines, which is what
 * the old scene was drawing in 519 lines of WebGL.
 */

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ssadhauvaluers.com";

const INTRO =
  "Valuations are inspected in person, so geography is part of the service. Two offices anchor the practice; nine cities are within inspection range, and the road between them is ours to drive, not yours.";

export const metadata = {
  title: "Locations — S S Adhau Valuers & Engineers",
  description:
    "Two offices and nine cities across Madhya Pradesh and Maharashtra. Offices in Nagpur and Chhindwara, with site inspections conducted on location in Betul, Seoni, Balaghat, Jabalpur, Bhopal, Indore and Pandhurna.",
  alternates: { canonical: "/locations" },
};

/* The two offices as places, with the territory each serves. Every address,
   coordinate and hour here is on the page in words as well. */
function jsonLd() {
  const offices = CITIES.filter((c) => c.kind === "office").map((c) => ({
    "@type": "LocalBusiness",
    "@id": `${SITE}/locations#${c.id}`,
    name: `S S Adhau Valuers & Engineers — ${c.name}`,
    parentOrganization: { "@id": `${SITE}/#organization` },
    telephone: PHONE,
    email: "ssadhauvaluers@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: c.address,
      addressLocality: c.name,
      addressRegion: c.state,
      addressCountry: "IN",
    },
    geo: { "@type": "GeoCoordinates", latitude: c.lat, longitude: c.lon },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "10:00",
      closes: "19:00",
    },
    areaServed: CITIES.map((x) => ({ "@type": "City", name: x.name })),
  }));
  return { "@context": "https://schema.org", "@graph": offices };
}

export default function LocationsPage() {
  return (
    <div className="er er-loc">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
      />
      {/* arms the entrance states before first paint — see the register */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "(function(){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;document.documentElement.classList.add('er-js');}catch(e){}})()",
        }}
      />
      <ServiceMotion rootSelector=".er-loc" />

      <a className="er-skip" href="#er-main">
        Skip to content
      </a>

      <StudioHeader />

      <main id="er-main">
        {/* ------------------------------ hero ---------------------- */}
        <div className="er-wrap">
          <section className="er-lochero" data-svc-block>
            <div>
              <p className="er-label er-lochero__eyebrow" data-svc-track>
                Locations
              </p>
              {/* the serif's one string on this page */}
              <h1 className="er-display er-lochero__t" data-svc-title>
                <span className="er-line">
                  <span>
                    Two offices. <em>Nine</em> cities.
                  </span>
                </span>
              </h1>
            </div>
            <div>
              <ReadingText text={INTRO} />
            </div>
          </section>
        </div>
        <div className="er-wrap">
          <span
            className="er-lochero__rule"
            data-svc-herorule
            aria-hidden="true"
          />
        </div>

        {/* --------------------------- territory -------------------- */}
        <section
          className="er-loc__block er-loc__block--terr"
          data-svc-block
        >
          <div className="er-wrap">
            <Territory />
          </div>
        </section>

        {/* ---------------------------- closing --------------------- */}
        <section className="er-loc__block er-loc__block--close" data-svc-block>
          <div className="er-wrap">
            <div className="er-locclose">
              <p className="er-locclose__line" data-svc-fade>
                If your city is not listed, call anyway. Roads go everywhere.
              </p>
              <a
                className="er-label er-locclose__cta"
                href={PHONE_HREF}
                data-svc-fade
              >
                <b>Speak to a valuer</b>
                <span aria-hidden="true">·</span>
                <b>{PHONE}</b>
              </a>
            </div>
          </div>
        </section>
      </main>

      <StudioFooter />
    </div>
  );
}
