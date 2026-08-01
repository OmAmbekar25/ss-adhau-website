import { notFound } from "next/navigation";
import "@/app/studio/studio.css";
import "./service.css";
import ServicePage from "@/components/services/ServicePage";
import { SERVICES, bySlug } from "@/data/services";
import { PHONE } from "@/components/studio/StudioChrome";

/* Six static pages from one template. `studio.css` is imported rather than
   copied: these pages inherit the locked system — tokens, the two-voice
   type lock, the two motion curves — and invent nothing of their own
   beyond the document layout in `service.css`. */

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const s = bySlug(slug);
  if (!s) return {};
  return {
    title: `${s.plain} — S S Adhau Valuers & Engineers`,
    description: s.meta,
    alternates: { canonical: `/services/${s.slug}` },
    openGraph: {
      title: `${s.plain} — S S Adhau Valuers & Engineers`,
      description: s.meta,
      images: [s.hero.src],
      type: "website",
    },
  };
}

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ssadhauvaluers.com";

/* Organization + Service, with the phone number on both, so the entity and
   the offering are linked rather than described twice. Every claim here is
   already on the page — nothing is asserted in structured data that a
   reader cannot also see. */
function jsonLd(s) {
  const org = {
    "@type": "Organization",
    "@id": `${SITE}/#organization`,
    name: "S S Adhau Valuers & Engineers",
    url: SITE,
    telephone: PHONE,
    address: [
      {
        "@type": "PostalAddress",
        streetAddress: "Manish Nagar",
        addressLocality: "Nagpur",
        postalCode: "440015",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
      {
        "@type": "PostalAddress",
        streetAddress: "Parasia Road",
        addressLocality: "Chhindwara",
        postalCode: "480001",
        addressRegion: "Madhya Pradesh",
        addressCountry: "IN",
      },
    ],
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      org,
      {
        "@type": "Service",
        "@id": `${SITE}/services/${s.slug}#service`,
        name: s.plain,
        description: s.meta,
        serviceType: s.plain,
        url: `${SITE}/services/${s.slug}`,
        provider: { "@id": `${SITE}/#organization` },
        areaServed: [
          { "@type": "AdministrativeArea", name: "Madhya Pradesh" },
          { "@type": "AdministrativeArea", name: "Maharashtra" },
        ],
        availableChannel: {
          "@type": "ServiceChannel",
          servicePhone: { "@type": "ContactPoint", telephone: PHONE },
        },
      },
    ],
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const service = bySlug(slug);
  if (!service) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(service)) }}
      />
      <ServicePage service={service} />
    </>
  );
}
