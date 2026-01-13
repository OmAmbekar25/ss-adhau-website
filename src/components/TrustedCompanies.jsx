import Image from "next/image";

const companies = [
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
  { src: "/logos/LIChousing.png", alt: "LIC housing Finance" },
  { src: "/logos/hdfc.png", alt: "HDFC Bank" },
  { src: "/logos/idbi.png", alt: "IDBI bank" },
  { src: "/logos/mpgb.jpg", alt: "MPGB" },
];



export default function TrustedCompanies() {
  return (
    <section className="bg-brand-light w-full py-16 px-4">
      <h3 className="text-center text-4xl md:text-5xl font-bold text-brand-navy">
        Trusted by Leading Indian Organizations
      </h3>
<div className="w-full flex justify-center mt-2">
       <div className="w-24  h-[3px] rounded-full bg-gradient-to-r from-brand-orange to-orange-100 mt-1" />

</div>
      <div className="max-w-6xl mx-auto mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {companies.map((company, index) => (
            // can add grayscale--> grayscale hover:grayscale-0
          <div
            key={index}
            className="flex items-center justify-center rounded-xl border  border-slate-200 bg-white p-5 shadow transition-all hover:shadow-lg"
          >
            <Image
              src={company.src}
              alt={company.alt}
              width={120}
              height={50}
              className="object-contain  transition"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

