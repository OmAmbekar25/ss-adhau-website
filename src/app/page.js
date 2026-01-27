import About from "@/components/About";
import { GridBackgroundDemo } from "@/components/BackgroundBoxes";
import  BouncyCardsFeatures  from "@/components/Features";
import HomeContact from "@/components/HomeContact";
import MarqueeCards from "@/components/MarqueeCards";
import TrustedCompanies from "@/components/TrustedCompanies";
import { div } from "motion/react-client";
import Image from "next/image";

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
