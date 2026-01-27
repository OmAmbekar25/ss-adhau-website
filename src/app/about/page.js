import AboutHero from "@/components/AboutHero";
import FAQ from "@/components/FAQ";
import TeamSection from "@/components/TeamSection";

export const metadata = {
  title: "About Us | SS Adhau Valuers",
  description: "Government registered valuation professionals",
};

export default function AboutPage() {
  return (
   <>
   <AboutHero />
   <TeamSection />
   <FAQ />
   </>

  );
}
