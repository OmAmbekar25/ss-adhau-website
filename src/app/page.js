import About from "@/components/About";
import { GridBackgroundDemo } from "@/components/BackgroundBoxes";
import  BouncyCardsFeatures  from "@/components/Features";
import { div } from "motion/react-client";
import Image from "next/image";

export default function Home() {
  return (
    <>
    <main className="min-h-screen bg-gray-200">
      <GridBackgroundDemo />
      <BouncyCardsFeatures />
      <About />
    </main>
    </>
  );
}
