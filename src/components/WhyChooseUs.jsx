import { Check } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <section className="w-full py-5">
      <div className="container mx-auto">
        <div className="flex flex-col items-start gap-4 py-20 lg:py-40">
          {/* Heading */}
          <div className="flex flex-col w-full items-center gap-2 text-center">
            <h2 className="text-3xl md:text-5xl tracking-tighter font-regular">
              Why Choose Us?
            </h2>
            <div className="w-full flex justify-center ">
              <div className="w-24  h-[3px] rounded-full bg-gradient-to-r from-brand-orange to-orange-100 mt-1" />
            </div>
            <p className="text-lg p-4 md:p-0 max-w-xl leading-relaxed tracking-tight text-muted-foreground">
              Trusted valuation professionals delivering accuracy, compliance,
              and timely insights across diverse asset classes.
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-col gap-10 pt-12 w-full">
            <div className="grid grid-cols-1 p-4 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                {
                  title: "Multi-Disciplinary Experts",
                  desc: "A team of registered valuers, engineers, and technical specialists covering real estate, plant & machinery, and business valuation.",
                },
                {
                  title: "Uncompromising Accuracy & Compliance",
                  desc: "Every report strictly adheres to statutory guidelines, valuation standards, and regulatory frameworks.",
                },
                {
                  title: "Local Market Mastery with Technical Depth",
                  desc: "Strong understanding of local market dynamics supported by robust technical data and analytical models.",
                },
                {
                  title: "Integrity & Confidentiality",
                  desc: "Complete confidentiality of client data with ethical practices at every stage of engagement.",
                },
                {
                  title: "Speed & Reliability",
                  desc: "Efficient processes ensure timely delivery without compromising quality or accuracy.",
                },
                {
                  title: "PAN India Presence",
                  desc: "Certified registered valuers delivering professional valuation services across India.",
                },
              ].map((item, index) => (
                <div key={index} className="flex flex-row gap-4 items-start">
                  <div className="mt-1 flex-shrink-0">
                    <Check className="w-5 h-5 text-primary" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="font-medium text-lg text-slate-800">{item.title}</p>
                    <p className="text-md text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
