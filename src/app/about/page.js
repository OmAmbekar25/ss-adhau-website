export const metadata = {
  title: "About Us | SS Adhau Valuers",
  description: "Government registered valuation professionals",
};

export default function AboutPage() {
  return (
    <section className="bg-brand-light px-6 md:px-16 lg:px-24 xl:px-32 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-semibold text-brand-navy mb-6">
          About Us
        </h1>

        <p className="text-lg text-brand-slate leading-relaxed mb-6">
          SS Adhau Valuers & Engineers is a team of Government Registered
          Valuers providing independent, compliant, and reliable valuation
          services across India.
        </p>

        <p className="text-lg text-brand-slate leading-relaxed">
          We serve banks, financial institutions, corporates, legal
          professionals, and individuals for regulatory, financial, and
          transaction-related valuation requirements.
        </p>
      </div>
    </section>
  );
}
