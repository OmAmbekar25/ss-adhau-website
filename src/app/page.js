import About from "@/components/About";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Spotlight from "@/components/Spotlight";
import OurPresence from "@/components/OurPresence";
import HomeContact from "@/components/HomeContact";
import MarqueeCards from "@/components/MarqueeCards";
import TrustedShowcase from "@/components/TrustedShowcase";
import OurProcess from "@/components/OurProcess";
import CaseStudies from "@/components/CaseStudies";

export const metadata = {
  title: "SS Adhau  | Registered Valuers and Chartered Engineers",
  description:
    "SS Adhau Valuers provides professional property valuation, chartered engineering, and consultancy services across Nagpur and Chhindwara.",
  keywords: [
    "SS Adhau Valuers",
    "Registered Valuer India",
    "Chartered Engineer",
    "Property Valuation Services",
    "Valuer Nagpur",
    "Valuer Chhindwara"
  ],
};

export default function Home() {
  return (
    <>
    <main className="min-h-screen ">
      <Hero />
      <TrustedShowcase />
      <Services />
      <Spotlight />
      <About />
      <OurProcess />
      <OurPresence />
      <CaseStudies />
      <MarqueeCards />
      <HomeContact />
    </main>
    </>
  );
}
