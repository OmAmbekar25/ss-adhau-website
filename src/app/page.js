import About from "@/components/About";
import { GridBackgroundDemo } from "@/components/BackgroundBoxes";
import  BouncyCardsFeatures  from "@/components/Features";
import HomeContact from "@/components/HomeContact";
import MarqueeCards from "@/components/MarqueeCards";
import TrustedCompanies from "@/components/TrustedCompanies";
import { div } from "motion/react-client";
import Image from "next/image";

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
      <GridBackgroundDemo />
      <BouncyCardsFeatures />
      <About />
      <TrustedCompanies />
      <MarqueeCards />
      <HomeContact />
    </main>
    </>
  );
}
