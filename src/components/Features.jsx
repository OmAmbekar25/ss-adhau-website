"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Factory,
  Scale,
  Briefcase,
  FileBarChart,
  GitMerge,
} from "lucide-react";

export default function BouncyCardsFeatures() {
  return (
    <div className="w-full bg-gray-200 ">
      <section id="services" className="mx-auto max-w-7xl px-4 py-16 text-slate-800">
      <div className="mb-12 md:px-8">
        <h2 className="max-w-3xl text-4xl font-bold md:text-5xl">
          Professional Valuation Services{" "}
          <span className="text-slate-400 block">You Can Trust</span>
        </h2>
      </div>

      {/* Row 1 */}
      <div className="mb-6 grid grid-cols-12 gap-6">
        <BounceCard className="col-span-12 md:col-span-4">
          <CardTitle
            icon={Building2}
            title="Valuation of Real Estate"
          />
          <FeatureAccent description="Valuation of residential, commercial, and industrial properties." />
        </BounceCard>

        <BounceCard className="col-span-12 md:col-span-8">
          <CardTitle
            icon={Factory}
            title="Valuation of Plant & Machinery"
          />
          <FeatureAccent description="Assessment of plant, machinery, and equipment considering age, condition, and market value." />
        </BounceCard>
      </div>

      {/* Row 2 */}
      <div className="mb-6 grid grid-cols-12 gap-6">
        <BounceCard className="col-span-12 md:col-span-8">
          <CardTitle
            icon={Scale}
            title="Valuation under IBC"
          />
          <FeatureAccent description="Valuation services under Insolvency & Bankruptcy Code for CIRP, liquidation, and resolution processes." />
        </BounceCard>

        <BounceCard className="col-span-12 md:col-span-4">
          <CardTitle
            icon={Briefcase}
            title="Business Valuation"
          />
          <FeatureAccent description="Valuation of businesses using income, market, and asset-based approaches." />
        </BounceCard>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-12 gap-6">
        <BounceCard className="col-span-12 md:col-span-4">
          <CardTitle
            icon={FileBarChart}
            title="Financial Reporting Valuation"
          />
          <FeatureAccent description="Fair value measurement for IFRS and IND AS compliance." />
        </BounceCard>

        <BounceCard className="col-span-12 md:col-span-8">
          <CardTitle
            icon={GitMerge}
            title="Mergers & Acquisitions"
          />
          <FeatureAccent description="Valuation support for mergers, acquisitions, restructuring, and strategic transactions." />
        </BounceCard>
      </div>
    </section>
    </div>
  );
}

/* ----------------------------- Components ----------------------------- */

const BounceCard = ({ className = "", children }) => {
  return (
    <motion.div
      whileHover={{ scale: 0.95, rotate: "-1deg" }}
      transition={{ type: "spring", stiffness: 260 }}
      className={`group relative min-h-[260px] cursor-pointer overflow-hidden rounded-2xl bg-white p-8 shadow-md ${className}`}
    >
      {children}
    </motion.div>
  );
};

const CardTitle = ({ title, icon: Icon }) => {
  return (
    <div className="relative z-10 mb-6 flex flex-col items-center text-center">
      <h3 className="text-2xl lg:text-3xl font-semibold">{title}</h3>
      <Icon className="mt-3 h-7 w-7 text-slate-500" />
    </div>
  );
};

const FeatureAccent = ({ description }) => {
  return (
    <div className="absolute bottom-0 left-4 right-4 top-32 translate-y-10 rounded-t-2xl bg-gradient-to-br from-brand-navy to-brand-slate p-6 transition-all duration-300 group-hover:translate-y-6">
      <p className="text-center text-sm md:text-sm lg:text-lg leading-relaxed text-white/90">
        {description}
      </p>
    </div>
  );
};
