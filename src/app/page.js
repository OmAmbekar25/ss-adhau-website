import About from "@/components/About";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Spotlight from "@/components/Spotlight";
import OurPresence from "@/components/OurPresence";
import HomeContact from "@/components/HomeContact";
import MarqueeCards from "@/components/MarqueeCards";
import TrustedShowcase from "@/components/TrustedShowcase";
import ValuationJourney from "@/components/ValuationJourney";
import CaseStudies from "@/components/CaseStudies";
import SurveyThread from "@/components/SurveyThread";

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
      {/* the thread reads these chapters straight off the page */}
      <SurveyThread />
      <main className="min-h-screen">
        <Hero />
        <div data-chapter="Trusted by">
          <TrustedShowcase />
        </div>
        <div data-chapter="Services">
          <Services />
        </div>
        <div data-chapter="On site">
          <Spotlight />
        </div>
        <div data-chapter="The process">
          <ValuationJourney />
        </div>
        <div data-chapter="The firm">
          <About />
        </div>
        <div data-chapter="Presence">
          <OurPresence />
        </div>
        <CaseStudies />
        <div data-chapter="In their words">
          <MarqueeCards />
        </div>
        <div data-chapter="Request a valuation">
          <HomeContact />
        </div>
      </main>
    </>
  );
}
