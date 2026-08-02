import "@/app/studio.css";
import "./contact.css";
import {
  StudioHeader,
  StudioFooter,
  PHONE,
  PHONE_HREF,
} from "@/components/studio/StudioChrome";
import ServiceMotion from "@/components/services/ServiceMotion";
import ReadingText from "@/components/services/ReadingText";
import ServicePicture from "@/components/services/ServicePicture";
import ContactForm from "@/components/contact/ContactForm";
import { CITIES, mapsUrl } from "@/data/territory";

/* CONTACT — the form and the two offices.
 *
 * This REPLACES the legacy "Get in Touch" page rather than restyling it.
 * Gone with it: the stock Scrabble-tiles photograph, the global nav and
 * footer, the pill button, the rounded translucent inputs and the
 * placeholder-as-label pattern. Gone with it too — and this is the point
 * of the rebuild — a live Formspree endpoint marked "🔴 REPLACE" in the
 * source, which sent every enquiry on a client's site to somebody else's
 * demo form.
 *
 * Delivery is now an honest stub. See src/app/api/contact/route.js. It is
 * a LAUNCH BLOCKER, logged in §15: a mail service has to be chosen before
 * this page goes live, or the phone number is the only path that works.
 *
 * Everything here is an existing pattern — the register's hero, the
 * service page's figure, the about page's fact rows, the shared closing
 * row. The one new thing is the form, because the site had no form.
 *
 * No canvas on this route.
 */

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ssadhauvaluers.com";

const LEDE =
  "Describe the asset and the purpose. A valuer replies, not a mailbox.";

const EMAIL = "ssadhauvaluers@gmail.com";
const HOURS = "Mon – Sat · 10:00 – 19:00";

/* The offices are read from territory.js, which is where the map page
   already keeps them — the addresses and the two map pins on this page
   are the same strings the footer and the territory carry, not a third
   copy that drifts. */
const OFFICES = CITIES.filter((c) => c.kind === "office");

export const metadata = {
  title: "Contact — S S Adhau Valuers & Engineers",
  description:
    "Speak to a registered valuer in Nagpur or Chhindwara. Describe the asset and the purpose, and a valuer replies.",
  alternates: { canonical: "/contact" },
};

function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact — S S Adhau Valuers & Engineers",
    url: `${SITE}/contact`,
    /* The Organization is emitted once by the root layout; this page
       references that node rather than restating it. The contact point is
       the only thing this page adds, and every value in it is on the page
       in words. */
    mainEntity: {
      "@id": `${SITE}/#organization`,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Enquiries",
        telephone: PHONE,
        email: EMAIL,
        areaServed: ["Madhya Pradesh", "Maharashtra"],
        availableLanguage: ["en", "hi", "mr"],
      },
    },
  };
}

export default function ContactPage() {
  return (
    <div className="er er-contact">
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
      <ServiceMotion rootSelector=".er-contact" />

      <a className="er-skip" href="#er-main">
        Skip to content
      </a>

      <StudioHeader />

      <main id="er-main">
        <div className="er-wrap">
          <section className="er-ct" data-svc-block>
            {/* ---------------------- the writing ---------------- */}
            <div>
              <p className="er-label er-ct__eyebrow" data-svc-track>
                Contact
              </p>
              {/* the serif's one string on this page */}
              <h1 className="er-display er-ct__t" data-svc-title>
                <span className="er-line">
                  <span>
                    Get in <em>touch</em>.
                  </span>
                </span>
              </h1>
              <ReadingText text={LEDE} className="er-ct__lede" />
              <ContactForm />
            </div>

            {/* ---------------------- the offices ---------------- */}
            <div>
              <figure className="er-ctfig" data-svc-fade>
                <ServicePicture
                  base="/images/pages/page-01-interior"
                  alt="A valuer's desk: drawings, a scale rule and a bound report."
                  sizes="(max-width: 1023px) 92vw, 420px"
                  width={1600}
                  height={2000}
                />
              </figure>

              <dl className="er-ctinfo">
                <div className="er-ctinfo__row" data-svc-fade>
                  <dt className="er-label er-ctinfo__k">Telephone</dt>
                  <dd>
                    <a className="er-ctinfo__v" href={PHONE_HREF}>
                      {PHONE}
                    </a>
                  </dd>
                </div>
                <div className="er-ctinfo__row" data-svc-fade>
                  <dt className="er-label er-ctinfo__k">Email</dt>
                  <dd>
                    <a className="er-ctinfo__v" href={`mailto:${EMAIL}`}>
                      {EMAIL}
                    </a>
                  </dd>
                </div>
                <div className="er-ctinfo__row" data-svc-fade>
                  <dt className="er-label er-ctinfo__k">Hours</dt>
                  <dd>
                    <p className="er-ctinfo__v">{HOURS}</p>
                  </dd>
                </div>
                {OFFICES.map((o) => (
                  <div className="er-ctinfo__row" key={o.id} data-svc-fade>
                    <dt className="er-label er-ctinfo__k">
                      {o.name} · {o.state}
                    </dt>
                    <dd>
                      <p className="er-ctinfo__v">{o.address}</p>
                      <a
                        className="er-label er-ctinfo__map"
                        href={mapsUrl(o)}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        View on map
                        <span aria-hidden="true">↗</span>
                      </a>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        </div>

        {/* ------------------------- the close ------------------- */}
        {/* The form is for writers; the number is for callers, and it is
            the path that works today. */}
        <section className="er-ct__close" data-svc-block>
          <div className="er-wrap">
            <div className="er-regclose">
              <p className="er-regclose__line" data-svc-fade>
                Some things are quicker said than written.
              </p>
              <a
                className="er-label er-regclose__cta"
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
