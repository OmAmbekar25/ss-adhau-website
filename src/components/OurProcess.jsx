"use client";

import { motion } from "motion/react";
import {
  ClipboardList,
  MapPinned,
  BarChart3,
  FileCheck2,
  Send,
} from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Enquiry & Scope",
    description:
      "We understand the asset, the purpose of valuation (bank mortgage, IBC, tax, M&A, etc.), and the applicable regulatory framework.",
  },
  {
    icon: MapPinned,
    title: "Site Inspection",
    description:
      "A registered valuer visits the site to physically inspect, measure, and document the property or asset in detail.",
  },
  {
    icon: BarChart3,
    title: "Market & Technical Analysis",
    description:
      "Local market data is cross-checked against technical and engineering assessments to arrive at a defensible value.",
  },
  {
    icon: FileCheck2,
    title: "Report & Certification",
    description:
      "A detailed valuation report is prepared and certified by our registered valuers, aligned with statutory standards.",
  },
  {
    icon: Send,
    title: "Delivery & Support",
    description:
      "The report is delivered to you, with ongoing support for any clarification needed by banks, courts, or regulators.",
  },
];

export default function OurProcess() {
  return (
    <section className="w-full bg-noir py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-4xl md:text-5xl text-linen">
            How We Work
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-brass to-brass/10 mt-3" />
          <p className="text-lg text-fog mt-4 max-w-2xl">
            A structured, transparent process from first enquiry to final
            report — built for accuracy and compliance at every step.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 relative">
          {/* Connecting line on large screens */}
          <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-brass/25 via-brass/25 to-brass/25 -z-0" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="relative flex items-center justify-center size-16 rounded-full border border-brass/40 bg-white/[0.04] text-brass shadow-lg mb-5">
                  <Icon className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 flex items-center justify-center size-6 rounded-full bg-brass text-noir text-xs font-bold">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-xl text-linen">
                  {step.title}
                </h3>
                <p className="text-sm text-fog mt-2 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
