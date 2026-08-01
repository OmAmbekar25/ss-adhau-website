import MapJourney from "@/components/MapJourney";

export const metadata = {
  title: "Locations | SS Adhau Valuers and Engineers",
  description:
    "S S Adhau Valuers & Engineers serves nine cities across Madhya Pradesh and Maharashtra — offices in Nagpur and Chhindwara, with site inspections conducted on location in Betul, Seoni, Balaghat, Jabalpur, Bhopal, Indore and Pandhurna.",
};

export default function LocationsPage() {
  return (
    <main className="min-h-screen bg-noir">
      <div className="mx-auto max-w-7xl px-6 pb-4 pt-16 md:px-10 md:pt-24">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brass">
          Areas we serve
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-[1.08] text-linen md:text-5xl">
          From our offices to your site, wherever it is.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-fog">
          Scroll to travel the network — two offices, nine cities, and every
          valuation begun with a physical site inspection.
        </p>
      </div>

      <MapJourney />
    </main>
  );
}
