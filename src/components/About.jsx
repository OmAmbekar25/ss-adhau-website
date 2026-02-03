"use client";

import Image from "next/image";
import AboutImage from "@/app/assets/images/about-image.jpg";
import User from "@/app/assets/images/user.jpg";
import Link from "next/link";


export default function About() {
  return (
    <section className="flex bg-brand-light flex-col md:flex-row items-center justify-center gap-10 max-md:px-4">
      
      {/* Image Card */}
      <div className=" hidden md:block relative  shadow-2xl mt-10 mb-10 shadow-indigo-600/40 rounded-2xl overflow-hidden shrink-0">
        <Image
          src={AboutImage}
          alt="Team collaboration"
          width={400}
          height={300}
          className="max-w-md w-full  object-cover rounded-2xl"
          priority
        />

        {/* Floating Card */}
        <div className="flex items-center gap-3 max-w-72 absolute bottom-8 left-8 bg-white p-4 rounded-xl">
          <div className="flex -space-x-4 shrink-0">
            <Avatar src={User} z="z-[1]" />
            <Avatar src={User} z="z-[2]" />
            <Avatar src={User} z="z-[3]" />

            <div className="flex items-center justify-center text-xs text-white size-9 rounded-full border-[3px] border-white bg-indigo-600 hover:-translate-y-1 transition z-[4]">
              10+
            </div>
          </div>

          <p className="text-sm font-medium text-slate-800">
            Contact us to know more
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="text-lg mt-10 md:mt-0 text-slate-600 max-w-lg">
        <h1 className="text-4xl md:text-5xl uppercase font-semibold text-slate-700">
          About Us
        </h1>

        <div className="w-24 h-[3px] rounded-full bg-gradient-to-r from-brand-orange to-orange-100 mt-1" />

        <p className="mt-8">
         We are a team of Government-Registered Valuers providing valuation services for movable, immovable, and agricultural properties across multiple regulatory and commercial requirements.
        </p>

        <p className="mt-4">
          Our expertise includes valuations for bank mortgages, capital gains tax, income tax compliance, buying and selling transactions, court matters, and Insolvency & Bankruptcy Code (IBC) assignments, including peer review services.
        </p>

        <p className="mt-4">
         We also deliver valuations for financial reporting as per Ind-AS, mergers and acquisitions, project feasibility analysis, and offer multidisciplinary support as competent persons, consulting engineers, and geotechnical, architectural, and structural consultants.
        </p>

        <Link
          href="/about"
          className="flex items-center w-max gap-2 mt-8 hover:-translate-y-0.5 transition bg-gradient-to-r from-indigo-600 to-indigo-400 py-3 px-8 rounded-full text-white"
        >
          <span>Read more</span>
          <ArrowIcon />
        </Link>
      </div>
    </section>
  );
}

/* -------------------- Small Components -------------------- */

const Avatar = ({ src, z }) => (
  <Image
    src={src}
    alt="User"
    width={36}
    height={36}
    className={`size-9 rounded-full border-[3px] border-white hover:-translate-y-1 transition ${z}`}
  />
);

const ArrowIcon = () => (
  <svg
    width="13"
    height="12"
    viewBox="0 0 13 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.53 6.53a.75.75 0 0 0 0-1.06L7.757.697a.75.75 0 1 0-1.06 1.06L10.939 6l-4.242 4.243a.75.75 0 0 0 1.06 1.06zM0 6v.75h12v-1.5H0z"
      fill="#fff"
    />
  </svg>
);
