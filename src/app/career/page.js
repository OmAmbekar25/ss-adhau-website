import { JobCardSimple } from "@/components/JobCard";

const jobs = [
  {
    title: "Real Estate Valuation Analyst",
    description:
      "Assist in property inspections, market research, financial modelling and preparation of detailed valuation reports.",
    href: "#",
    badgeColor: "indigo",
    badgeText: "Valuation",
    location: "Nagpur / On-site",
    type: "Full-time",
  },
  {
    title: "Chartered Engineer (Plant & Machinery)",
    description:
      "Conduct technical inspections and prepare valuation reports for plant, machinery and industrial assets.",
    href: "#",
    badgeColor: "orange",
    badgeText: "Engineering",
    location: "Maharashtra",
    type: "Full-time",
  },
  {
    title: "Legal & Compliance Executive",
    description:
      "Handle documentation, regulatory compliance and coordination with banks and financial institutions.",
    href: "#",
    badgeColor: "blue",
    badgeText: "Compliance",
    location: "Nagpur",
    type: "Full-time",
  },
];

export default function CareersSimple01() {
  return (
    <section className="bg-noir py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">

        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-linen">
            Careers at SS Adhau Valuation
          </h2>
          <p className="mt-4 text-fog md:text-lg">
            Join a multidisciplinary team delivering accurate,
            compliant and bank-approved valuation services across India.
            We value integrity, precision and professional growth.
          </p>
        </div>

        {/* Why Work With Us */}
        <div className="mt-12 grid gap-6 md:grid-cols-3 text-center">
          <div className="p-6 border rounded-xl">
            <h3 className="font-semibold text-linen">
              Professional Growth
            </h3>
            <p className="mt-2 text-sm text-fog">
              Exposure to banking, financial institutions and diverse asset classes.
            </p>
          </div>

          <div className="p-6 border rounded-xl">
            <h3 className="font-semibold text-linen">
              Technical Excellence
            </h3>
            <p className="mt-2 text-sm text-fog">
              Work alongside experienced valuers, engineers and compliance experts.
            </p>
          </div>

          <div className="p-6 border rounded-xl">
            <h3 className="font-semibold text-linen">
              Integrity & Impact
            </h3>
            <p className="mt-2 text-sm text-fog">
              Deliver valuation reports that influence real financial decisions.
            </p>
          </div>
        </div>

        {/* Job Listings */}
        <div className="mt-16 max-w-4xl mx-auto">
          {jobs.length > 0 ? (
            <ul className="flex flex-col gap-6">
              {jobs.map((job, index) => (
                <li key={index}>
                  <JobCardSimple {...job} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center border rounded-xl p-10">
              <p className="text-fog">
                There are currently no open positions.
              </p>
              <p className="mt-2 text-sm text-fog">
                You may still send your resume to{" "}
                <span className="font-medium text-linen">
                  careers@ssadhuvaluation.com
                </span>
              </p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-fog">
            Don’t see a role that fits?
          </p>
          <a
            href="mailto:careers@ssadhuvaluation.com"
            className="inline-block mt-4 px-6 py-3 border border-brass/60 text-brass font-semibold rounded-full text-sm hover:bg-brass hover:text-noir transition"
          >
            Contact Us
          </a>
        </div>

      </div>
    </section>
  );
}