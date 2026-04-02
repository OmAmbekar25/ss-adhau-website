import AboutHero from "@/components/AboutHero";
import FAQ from "@/components/FAQ";
import TeamSection from "@/components/TeamSection";
import TrustedCompaniesAbout from "@/components/TrustedCompaniesAbout";

export const metadata = {
  title: "About Us | SS Adhau Valuers and Engineers",
  description: "Government registered valuation professionals",
};

export default function AboutPage() {
  return (
   <>
   <AboutHero />
   <TeamSection />
   <TrustedCompaniesAbout />
   <FAQ />
   </>

  );
}
