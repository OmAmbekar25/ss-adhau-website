import {
  IBM_Plex_Sans,
  Cormorant_Garamond,
  Archivo,
  IBM_Plex_Mono,
  Fraunces,
  Geist_Mono,
} from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SmoothScroll from "../components/SmoothScroll";
import ChromeGate from "../components/ChromeGate";
import HashScroll from "../components/HashScroll";

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

/* M-4 — the Organization node lives in the root layout, so every page
   carries it and anything that references `#organization` by @id (the
   services register's ItemList, for one) resolves against a node the
   document actually contains. The LocalBusiness below stays: it is the
   thing with two street addresses, opening hours and a phone number, and
   Organization is the thing everything else points at. */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "S S Adhau Valuers & Engineers",
  url: SITE_URL,
  email: "ssadhauvaluers@gmail.com",
  telephone: "+91-8793000929",
  /* §0 — one mark everywhere, and always in its own colours. This was
     `mark-white.png`, the silhouette R-4 painted from the logo's alpha
     channel; that file is deleted and a search engine showing this
     organisation should show the real thing. */
  logo: `${SITE_URL}/brand/logo-mark.png`,
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
    // suppressHydrationWarning: the home page's pre-paint script writes
    // classes onto <html> before hydration — intentional, not a mismatch.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body
        className={`${plexSans.variable} ${cormorant.variable} ${fraunces.variable} ${archivo.variable} ${plexMono.variable} ${geistMono.variable} antialiased`}
      >
        <SmoothScroll>
          <HashScroll />
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
