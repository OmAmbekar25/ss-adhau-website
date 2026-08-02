/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [75, 90],
  },
  /* `/studio` was the design candidate's URL for three weeks and is the
     only address some links and bookmarks know. It is a permanent redirect
     rather than a rewrite or a page that links onward: the candidate did
     not move, it became the home page, and a 308 is how you say that to a
     crawler. Server-side, so nothing 404s while JavaScript loads. */
  async redirects() {
    return [
      { source: "/studio", destination: "/", permanent: true },
      /* The member subpages are gone; their content lives in /about's
         inline dossiers. The hash rides the Location header, and /about
         opens the named dossier on load. */
      { source: "/team/:slug", destination: "/about#:slug", permanent: true },
    ];
  },
};

export default nextConfig;
