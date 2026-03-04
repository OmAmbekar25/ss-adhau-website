"use client";

import React from "react";
import { cn } from "../../lib/utils";
import { TypewriterEffectSmoothDemo } from "./Typewriter";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function GridBackgroundDemo() {
  return (
    <div className="relative flex   md:min-h-[80vh]  w-full items-center justify-center bg-brand-light dark:bg-black px-6">
      {/* Grid background */}
      <div
        className={cn(
          "absolute inset-0",
          "bg-[size:40px_40px]",
          "bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />

      {/* Radial fade */}
      <div className="pointer-events-none absolute inset-0 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />

      {/* Content */}
      <div className="relative  z-20 grid w-full max-w-7xl grid-cols-1 items-center  gap-12 md:grid-cols-2">
        {/* LEFT — Typewriter */}
        <div className="text-center mt-20 md:mt-0 md:ml-14 xl:ml-32 md:text-left">
          <div className="py-8 text-4xl font-bold sm:text-7xl">
            <span className="bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-transparent">
              <TypewriterEffectSmoothDemo />
            </span>
          </div>
        </div>

        {/* RIGHT — Lottie */}
        <div className="hidden md:flex md:justify-end">
          <DotLottieReact
            src="/animations/Real Estate (2).lottie"
            autoplay
            loop
            className="h-64 w-64 sm:h-80 sm:w-80 lg:h-120 lg:w-120"
          />
        </div>
      </div>
    </div>
  );
}
