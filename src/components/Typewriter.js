"use client";
import { motion } from "motion/react";
import { TypewriterEffectSmooth } from "./ui/typewriter-effect";
export function TypewriterEffectSmoothDemo() {
  const words = [
    {
      text: "S \u00A0",
      className: "text-brand-orange  dark:text-blue-500",
    },
    {
      text: "S \u00A0",
      className: "text-brand-orange  dark:text-blue-500",
    },
    {
      text: "Adhau\u00A0",
      className: "text-brand-orange dark:text-blue-500",
    },
    {
      text: "Valuers\u00A0",
    },
    {
      text: "&\u00A0",
    },
    {
      text: "Engineers",
    },
  ];
  return (
    <div className="flex  flex-col mt-10 md:mt-0 items-center md:justify-center min-h-[60vh]  ">
      <p className="text-neutral-600 dark:text-neutral-200 text-xl md:text-xl   ">
        Precision in assessment , Integrity in Value
      </p>
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col mt-5 md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        <motion.a
          href="#services"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center justify-center w-40 h-10 rounded-xl bg-black text-white text-sm"
        >
          View Our Services
        </motion.a>
        {/* <button
          className="w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm">
          Consult a Valuer
        </button> */}
      </div>
    </div>
  );
}
