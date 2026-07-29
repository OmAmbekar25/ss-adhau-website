import Image from "next/image";
import Link from "next/link";
import Sticky from "@/components/Sticky";
import Reveal from "@/components/Reveal";

export default function Spotlight() {
  return (
    <section className="bg-noir px-6 py-24 md:px-10 border-y border-[rgba(242,239,233,0.07)]">
      <div className="mx-auto max-w-7xl">
        <Sticky
          className="items-center gap-16"
          visual={
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl">
              <Image
                src="/images/valuelady.jpg"
                alt="A registered valuer inspecting a property on site, tablet in hand"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 40vw, 90vw"
              />
            </div>
          }
        >
          <Reveal index={0}>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brass">
              How we work · Step 02
            </p>
          </Reveal>
          <Reveal index={1}>
            <h2 className="mt-4 text-3xl leading-tight text-linen md:text-5xl">
              Every valuation starts on site, not at a desk.
            </h2>
          </Reveal>
          <Reveal index={2}>
            <p className="mt-6 max-w-md text-lg text-fog">
              A registered valuer physically inspects and measures the
              property before a single figure is written down. No desktop
              estimates, no relying on photographs sent over WhatsApp —
              the report reflects what was actually seen on site.
            </p>
          </Reveal>
          <Reveal index={3}>
            <p className="mt-6 max-w-md text-lg text-fog">
              That inspection is cross-checked against local market data and
              technical analysis, so the final number holds up when a bank,
              a court, or a regulator asks how it was reached.
            </p>
          </Reveal>
          <Reveal index={4}>
            <Link
              href="/contact"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full border border-brass/60 px-7 text-sm font-semibold text-brass transition hover:bg-brass hover:text-noir"
            >
              Request a valuation
            </Link>
          </Reveal>
        </Sticky>
      </div>
    </section>
  );
}
