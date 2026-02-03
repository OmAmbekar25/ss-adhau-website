import { Crosshair, Map, UsersRound } from "lucide-react";
import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="py-12 ">
      {/* Heading */}
      <h1 className="text-4xl md:text-5xl font-semibold text-center mx-auto">
        Our Story
      </h1>
      <div className="w-full flex justify-center mt-2">
        <div className="w-24  h-[3px] rounded-full bg-gradient-to-r from-brand-orange to-orange-100 mt-1" />
      </div>
      <p className="text-lg p-4 text-slate-500 text-center mt-2 max-w-7xl  mx-auto">
        SS Adhau Valuers is a professionally managed valuation firm providing
        accurate, compliant, and independent valuation services across diverse
        asset classes. Backed by certified registered valuers and strong domain
        expertise, we deliver reliable valuation reports aligned with statutory,
        regulatory, and industry standards across India.
      </p>

      {/* Content */}
      <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-10 px-4 md:px-0 py-10">
        {/* Text Content */}
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-semibold">
            What you can Expect
          </h2>
          <p className="text-lg text-slate-500 mt-2">
            We deliver independent, accurate, and regulation-compliant valuation
            services backed by technical expertise, market intelligence, and
            uncompromising professional ethics.
          </p>

          <div className="flex flex-col gap-8 mt-6">
            {/* Feature 1 */}
            <div className="flex items-start gap-4">
              <div className="w-10 p-2 bg-indigo-50 border border-indigo-200 rounded">
                <UsersRound />
              </div>
              <div>
                <h3 className="text-xl font-medium text-slate-600">
                  Multi-Disciplinary Experts
                </h3>
                <p className="text-lg text-slate-500">
                  A qualified team of registered valuers, engineers, and domain
                  specialists covering real estate, machinery, financial, and
                  specialized assets.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4">
              <div className="w-10 p-2 bg-indigo-50 border border-indigo-200 rounded">
                <Crosshair />
              </div>
              <div>
                <h3 className="text-xl font-medium text-slate-600">
                  Uncompromising Accuracy & Compliance
                </h3>
                <p className="text-lg text-slate-500">
                  Valuations strictly aligned with IBC, Income Tax, Companies
                  Act, RBI, IFRS, IND AS, and other applicable regulatory
                  frameworks.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4">
              <div className="w-10 p-2 bg-indigo-50 border border-indigo-200 rounded">
                <Map />
              </div>
              <div>
                <h3 className="text-xl font-medium text-slate-600">
                  Local Market Insight + Technical Data
                </h3>
                <p className="text-lg text-slate-500">
                  Strong understanding of regional market dynamics combined with
                  robust technical analysis for defensible and realistic
                  valuations.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            {/* <div className="flex items-start gap-4">
              <div className="size-9 p-2 bg-indigo-50 border border-indigo-200 rounded">
                <Image
                  src="/images/consulting.jpg"
                  alt="Integrity"
                  width={24}
                  height={24}
                />
              </div>
              <div>
                <h3 className="text-base font-medium text-slate-600">
                  Integrity & Confidentiality
                </h3>
                <p className="text-sm text-slate-500">
                  Complete independence, ethical conduct, and strict
                  confidentiality across all client engagements.
                </p>
              </div>
            </div> */}

            {/* Feature 5 */}
            {/* <div className="flex items-start gap-4">
              <div className="size-9 p-2 bg-indigo-50 border border-indigo-200 rounded">
                <Image
                  src="/images/consulting.jpg"
                  alt="Speed & Reliability"
                  width={24}
                  height={24}
                />
              </div>
              <div>
                <h3 className="text-base font-medium text-slate-600">
                  Speed & Reliability
                </h3>
                <p className="text-sm text-slate-500">
                  Time-bound delivery of high-quality valuation reports without
                  compromising accuracy or compliance.
                </p>
              </div>
            </div> */}
          </div>
        </div>

        {/* Image on RIGHT */}
        <div className="flex-1 flex justify-center">
          <Image
            src="/images/valuelady.jpg"
            alt="App preview"
            width={400}
            height={420}
            className="rounded-xl object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
