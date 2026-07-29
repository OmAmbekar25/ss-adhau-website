const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ssadhauvaluers.com";

const teamSlugs = [
  "sudhakar-adhau",
  "sunil-adhau",
  "nishigandha-adhau",
  "prateek-agrawal",
  "renuka-trivedi",
];

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

  const teamRoutes = teamSlugs.map((slug) => ({
    url: `${SITE_URL}/team/${slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...teamRoutes];
}
