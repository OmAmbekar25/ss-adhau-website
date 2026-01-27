import Image from "next/image";

const logos = [
  { src: "/logos/incometax.png", alt: "Income Tax" },
  { src: "/logos/SBI.png", alt: "SBI" },
  { src: "/logos/DebtsRecovery.png", alt: "DRT" },
  { src: "/logos/unionbank.png", alt: "Union Bank" },
  { src: "/logos/centralbank.png", alt: "Central Bank" },

  { src: "/logos/boi.png", alt: "Bank Of India" },
  { src: "/logos/indianbanklogo.png", alt: "Indian Bank" },
  { src: "/logos/punjab.png", alt: "PNB" },
  { src: "/logos/canara.png", alt: "Canara Bank" },
  { src: "/logos/uco.png", alt: "UCO Bank" },

  { src: "/logos/bankofmh.png", alt: "Bank Of Maharashtra" },
  { src: "/logos/LIChousing.png", alt: "LIC Housing Finance" },
  { src: "/logos/hdfc.png", alt: "HDFC Bank" },
  { src: "/logos/idbi.png", alt: "IDBI Bank" },
  { src: "/logos/mpgb.jpg", alt: "MPGB" },

  { src: "/logos/accordhotel.jpg", alt: "Hotel Accord International" },
  { src: "/logos/accordpench.jpg", alt: "Accord Wildlife Pench Resort" },
  { src: "/logos/penchinternational.png", alt: "The Pench International Resort" },
  { src: "/logos/penchjunglecamp.png", alt: "Pench Jungle Camp" },
  { src: "/logos/palashresort.jpg", alt: "Palash Vann Resort" },
];

export default function TrustedCompaniesAbout() {
  return (
    <section className="px-4 py-16">
      <h2 className="text-3xl md:text-5xl font-semibold text-center">
        Trusted by India’s Leading Organizations
      </h2>
       <div className="w-full flex justify-center mt-2">
        <div className="w-24  h-[3px] rounded-full bg-gradient-to-r from-brand-orange to-orange-100 mt-1" />
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4 max-w-7xl mx-auto mt-14">
        {logos.map((logo, index) => (
          <div
            key={index}
            className="flex items-center justify-center aspect-square bg-gray-50 border border-gray-200 rounded-md p-4"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
