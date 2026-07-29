import {
  Building2,
  Factory,
  Scale,
  Briefcase,
  FileBarChart,
  GitMerge,
} from "lucide-react";
import Reveal from "@/components/Reveal";

const services = [
  {
    icon: Building2,
    title: "Real estate valuation",
    description:
      "Independent valuation of residential, commercial, and industrial property for sale, mortgage, or compliance.",
  },
  {
    icon: Factory,
    title: "Plant & machinery valuation",
    description:
      "Assessment of plant, equipment, and machinery by age, condition, and market value.",
  },
  {
    icon: Scale,
    title: "Valuation under IBC",
    description:
      "Valuation for CIRP, liquidation, and resolution processes under the Insolvency and Bankruptcy Code.",
  },
  {
    icon: Briefcase,
    title: "Business valuation",
    description:
      "Valuation of businesses using income, market, and asset-based approaches.",
  },
  {
    icon: FileBarChart,
    title: "Financial reporting valuation",
    description: "Fair value measurement for Ind-AS and IFRS compliance.",
  },
  {
    icon: GitMerge,
    title: "Merger & acquisition support",
    description:
      "Valuation support for mergers, acquisitions, and corporate restructuring.",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-noir px-6 py-24 md:px-10">
      <div className="mx-auto max-w-7xl">
        <Reveal index={0}>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brass">
            What we do
          </p>
        </Reveal>
        <Reveal index={1}>
          <h2 className="mt-3 max-w-xl text-3xl text-linen md:text-5xl">
            Six services, one standard of evidence.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <Reveal key={service.title} index={i}>
                <div className="group h-full rounded-3xl border border-[rgba(242,239,233,0.1)] bg-white/[0.03] p-8 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-brass/40">
                  <div className="flex size-12 items-center justify-center rounded-full bg-brass/10">
                    <Icon className="size-5 text-brass" />
                  </div>
                  <h3 className="mt-6 text-2xl text-linen">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-fog">
                    {service.description}
                  </p>
                  <span className="mt-6 block h-px w-8 bg-brass transition-all duration-200 group-hover:w-12" />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
