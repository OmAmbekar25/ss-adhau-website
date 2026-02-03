import ServiceHero from "@/components/ui/Servicehero";
import WhyChooseUs from "@/components/WhyChooseUs";
import {
  Building2,
  Factory,
  Wheat,
  ShieldCheck,
  Scale,
  FileText,
  Landmark,
  Gavel,
  BarChart3,
  LineChart,
  Briefcase,
  ClipboardCheck,
  Award,
  Calculator,
  Ruler,
  Layers,
} from "lucide-react";

const services = [
  {
    title: "Valuation of Real Estate",
    description:
      "Independent valuation of residential, commercial, and industrial properties for sale, purchase, mortgage, and compliance purposes.",
    icon: Building2,
    bg: "bg-violet-100",
    color: "text-violet-600",
  },
  {
    title: "Valuation of Plant & Machinery",
    description:
      "Assessment of plant, equipment, and machinery considering age, condition, usage, and market value.",
    icon: Factory,
    bg: "bg-green-100",
    color: "text-green-600",
  },
  {
    title: "Valuation of Agricultural Lands",
    description:
      "Professional valuation of agricultural and rural lands based on soil quality, location, and regulatory factors.",
    icon: Wheat,
    bg: "bg-orange-100",
    color: "text-orange-600",
  },
  {
    title: "Valuer for Specialized Assets",
    description:
      "Valuation of unique and specialized assets including infrastructure, utilities, and purpose-built properties.",
    icon: ShieldCheck,
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  {
    title: "Fairness Opinion",
    description:
      "Independent fairness opinions to support mergers, acquisitions, and related-party transactions.",
    icon: Scale,
    bg: "bg-purple-100",
    color: "text-purple-600",
  },
  {
    title: "Valuation under Insolvency and Bankruptcy Code",
    description:
      "IBC-compliant valuation services for CIRP, liquidation, and resolution processes.",
    icon: FileText,
    bg: "bg-rose-100",
    color: "text-rose-600",
  },
  {
    title: "Valuation for Insurance",
    description:
      "Asset valuation for insurance coverage, reinstatement value, and risk assessment.",
    icon: Landmark,
    bg: "bg-indigo-100",
    color: "text-indigo-600",
  },
  {
    title: "Valuation for Regulatory Purposes",
    description:
      "Valuations for Income Tax, Company Law matters, and other statutory requirements.",
    icon: Gavel,
    bg: "bg-teal-100",
    color: "text-teal-600",
  },
  {
    title: "Litigation Support & Business Valuation",
    description:
      "Expert valuation reports and support for disputes, arbitration, and court proceedings.",
    icon: BarChart3,
    bg: "bg-cyan-100",
    color: "text-cyan-600",
  },
  {
    title: "Financial Reporting (IFRS, IND AS, US GAAP)",
    description:
      "Valuations aligned with international and Indian accounting standards for financial reporting.",
    icon: LineChart,
    bg: "bg-emerald-100",
    color: "text-emerald-600",
  },
  {
    title: "Mergers & Acquisitions",
    description:
      "Valuation support for strategic transactions, restructuring, and corporate advisory engagements.",
    icon: Briefcase,
    bg: "bg-amber-100",
    color: "text-amber-600",
  },
  {
    title: "Project Cost Vetting",
    description:
      "Independent review and vetting of project costs to ensure accuracy and feasibility.",
    icon: ClipboardCheck,
    bg: "bg-lime-100",
    color: "text-lime-600",
  },
  {
    title: "Chartered Engineer Certificate",
    description:
      "Issuance of Chartered Engineer certificates for statutory, banking, and regulatory needs.",
    icon: Award,
    bg: "bg-fuchsia-100",
    color: "text-fuchsia-600",
  },
  {
    title: "Project Cost Estimation",
    description:
      "Detailed estimation of project costs across planning, execution, and feasibility stages.",
    icon: Calculator,
    bg: "bg-sky-100",
    color: "text-sky-600",
  },
  {
    title: "Architectural Services",
    description:
      "End-to-end architectural planning, design development, and technical documentation.",
    icon: Ruler,
    bg: "bg-neutral-100",
    color: "text-neutral-700",
  },
  
];

export const metadata = {
  title: "Services | SS Adhau Valuers",
  description: "Professional valuation services across India",
};

export default function ServicesPage() {
  return (
    <>
     <div className="overflow-x-hidden">
       <ServiceHero />
      <div className="flex flex-col items-center mb-10 ">
         <h1 className="text-4xl md:text-5xl uppercase font-semibold text-slate-700">
          We Provide
        </h1>

        <div className="w-24 h-[3px] rounded-full bg-gradient-to-r from-brand-orange to-orange-100 mt-1" />
      </div>
      {/* <div className="flex justify-center"> */}
        <div className="grid  lg:px-44 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative">
        {/* Background blur – unchanged */}
        <div className="size-[520px] top-0 left-1/2 -translate-x-1/2 rounded-full absolute blur-[300px] -z-10 bg-[#FBFFE1]/70" />

        {services.map((service, index) => {
          const Icon = service.icon;

          return (
            <div
              key={index}
              className="flex flex-col items-center justify-center max-w-80 mx-auto"
            >
              <div
                className={`p-6 aspect-square rounded-full ${service.bg} flex items-center justify-center`}
              >
                <Icon className={`w-7 h-7 ${service.color}`} />
              </div>

              <div className="mt-5 space-y-2 text-center">
                <h3 className="text-lg font-semibold text-slate-700">
                  {service.title}
                </h3>

                <p className="text-md text-slate-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {/* </div> */}
      <WhyChooseUs />
     </div>
    </>
  );
}
