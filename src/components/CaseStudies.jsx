"use client";

import { motion } from "motion/react";
import caseStudies from "@/data/caseStudies";

export default function CaseStudies() {
  if (!caseStudies || caseStudies.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-noir py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-4xl md:text-5xl text-linen">
            Assignments We&apos;ve Delivered
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-brass to-brass/10 mt-2" />
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
          {caseStudies.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="snap-start shrink-0 w-80 rounded-3xl border border-[rgba(242,239,233,0.1)] bg-white/[0.04] p-8"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-brass/40">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item.year && (
                  <span className="text-xs font-semibold uppercase tracking-wide text-brass bg-brass/10 px-3 py-1 rounded-full">
                    Completed {item.year}
                  </span>
                )}
              </div>
              {item.category && (
                <p className="text-xs font-medium text-brass uppercase tracking-wide mb-1">
                  {item.category}
                </p>
              )}
              <h3 className="text-xl text-linen">
                {item.title}
              </h3>
              <p className="text-sm text-fog mt-3 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
