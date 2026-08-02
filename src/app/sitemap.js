import { SERVICES } from "@/data/services";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ssadhauvaluers.com";

export default function sitemap() {
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/locations",
    "/career",
    "/contact",
  ].map(
    (route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: route === "" ? 1 : 0.8,
    })
  );

  /* The six practice pages have been live since they shipped and were
     never listed — `/services` was in the map, the pages it links to were
     not. `/studio` never appeared here at all, so the route move needs
     nothing removed: "" IS the promoted page now, and it was already
     carrying priority 1. */
  const serviceRoutes = SERVICES.map((s) => ({
    url: `${SITE_URL}/services/${s.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  /* the /team/[slug] pages 301 to /about#slug and leave the map */
  return [...staticRoutes, ...serviceRoutes];
}
