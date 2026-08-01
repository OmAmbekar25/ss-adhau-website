import {
  IBM_Plex_Sans,
  Cormorant_Garamond,
  Archivo,
  IBM_Plex_Mono,
  Fraunces,
  Geist_Mono,
  Newsreader,
} from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SmoothScroll from "../components/SmoothScroll";
import ChromeGate from "../components/ChromeGate";

// Hero typography (v3 design language) — self-hosted at build by next/font
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-archivo",
  display: "swap",
});
/* Display face for the studio page only — the brief's own alternative to
   Cormorant. Higher contrast, sharper serifs, a more characterful italic.
   The rest of the site keeps Cormorant. */
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

/* WI-5.4 — the site's measuring voice. Geist Mono is variable 100-900 and
   free under the SIL licence; only the weights the two-voice system uses
   are loaded. IBM Plex Mono stays as the fallback in the stack while the
   rest of the site migrates.

   600 was added when P-2 made the mono the display voice: the headers,
   slide titles and stat numbers ask for it, and with only 400 and 500 in
   the @font-face set the browser was synthesising the bold rather than
   using the real cut. */
const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-geist-mono",
  display: "swap",
});

/* The third voice. The system was two — a display serif that speaks and a
   mono that measures — and mono is a poor reading face at paragraph
   length: uniform advance width defeats the word-shape recognition that
   makes prose skimmable. Newsreader is the reading serif and nothing else;
   see §15 for the restated lock.

   Subset to latin, roman and italic at 400 only. No `axes`: next/font
   rejects an axis list alongside a pinned weight, because naming axes
   means taking the whole variable font and letting weight vary too. The
   brief asks for 400 and 400 italic and nothing else, so the static cuts
   are both the literal reading and the smaller download — Newsreader's
   static instances are already drawn at a text optical size, which is
   what pinning opsz was for. */
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
  /* Declared for the whole site but preloaded for none of it. Every font
     in this layout is preloaded on every route, so `/studio` was
     downloading all ten files and rendering with three — adding a reading
     face made that worse rather than better. Without the preload link the
     @font-face is still there and the browser fetches the file only when
     something on the page actually sets a glyph in it: service pages get
     it, everything else does not. The reading text sits below the hero
     fold, so the later start costs nothing visible.
     TODO: the same is true of Cormorant, Archivo and IBM Plex Mono on
     these two routes — a sitewide change, out of scope here. */
  preload: false,
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-plex-mono",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// TODO: replace with the live production domain once deployed/purchased.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ssadhauvaluers.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
 title: "S S Adhau Valuers & Engineers | Chartered Engineers & Registered Valuers in Nagpur & Chhindwara",

  description:
    "S S Adhau Valuers & Engineers provides professional valuation services, chartered engineering consultancy, and structural design solutions in Nagpur and Chhindwara. Trusted for accuracy, compliance, and reliability.",

  keywords: [
    "Valuers in Nagpur",
    "Registered Valuers India",
    "Chartered Engineer Nagpur",
    "Property Valuation Nagpur",
    "Structural Engineer Chhindwara",
    "Engineering Consultancy India",
    "IBBI Registered Valuer",
    "Real Estate Valuation Services",
  ],

  authors: [{ name: "S S Adhau Valuers & Engineers" }],

  openGraph: {
    title: "S S Adhau Valuers & Engineers",
    description:
      "Registered Valuers and Chartered Engineers providing property, plant & machinery, and business valuation services across Nagpur, Chhindwara and PAN India.",
    url: SITE_URL,
    siteName: "S S Adhau Valuers & Engineers",
    images: ["/images/SSAdhauBG.png"],
    locale: "en_IN",
    type: "website",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "S S Adhau Valuers & Engineers",
  description:
    "Government-registered valuers and chartered engineers providing property, plant & machinery, and business valuation services.",
  email: "ssadhauvaluers@gmail.com",
  telephone: "+91-8793000929",
  priceRange: "₹₹",
  areaServed: [
    "Nagpur",
    "Chhindwara",
    "Betul",
    "Seoni",
    "Balaghat",
    "Jabalpur",
    "Bhopal",
    "Indore",
    "Pandhurna",
  ],
  address: [
    {
      "@type": "PostalAddress",
      streetAddress:
        "Plot No. 54, Panchtara Society, behind Krishna Super Market 1 (near overbridge), Manish Nagar",
      addressLocality: "Nagpur",
      postalCode: "440015",
      addressCountry: "IN",
    },
    {
      "@type": "PostalAddress",
      streetAddress:
        "F - 02, First Floor, Jail Bagicha Complex, In Front of B.S.N.L Office, Parasia Road, Satkar Tiraha",
      addressLocality: "Chhindwara",
      addressRegion: "MP",
      postalCode: "480001",
      addressCountry: "IN",
    },
  ],
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
};

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: the studio page's pre-paint script writes
    // classes onto <html> before hydration — intentional, not a mismatch.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body
        className={`${plexSans.variable} ${newsreader.variable} ${cormorant.variable} ${fraunces.variable} ${archivo.variable} ${plexMono.variable} ${geistMono.variable} antialiased`}
      >
        <SmoothScroll>
          <ChromeGate>
            <Navbar />
          </ChromeGate>
          {children}
          <ChromeGate>
            <Footer />
          </ChromeGate>
        </SmoothScroll>
      </body>
    </html>
  );
}
