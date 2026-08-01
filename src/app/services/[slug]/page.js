import { notFound } from "next/navigation";
import "@/app/studio.css";
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

/* Service only. The Organization it names as provider is emitted by the
   root layout on every page (M-4), with the same `#organization` @id — so
   this graph points at that node instead of restating the firm's name,
   phone and two addresses on six more pages, which is six more places for
   them to drift out of date. */
function jsonLd(s) {
  return {
    "@context": "https://schema.org",
    "@graph": [
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
