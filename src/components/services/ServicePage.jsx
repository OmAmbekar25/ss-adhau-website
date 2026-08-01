import Link from "next/link";
import {
  StudioHeader,
  StudioFooter,
  PHONE,
  PHONE_HREF,
  WHATSAPP_HREF,
} from "@/components/studio/StudioChrome";
import ServiceMotion from "./ServiceMotion";
import ServicePicture, { ServiceHeroPreload } from "./ServicePicture";
import ReadingText from "./ReadingText";
import { PRACTICAL, nextOf } from "@/data/services";

/* ONE template. Six payloads. No per-page fork.
 *
 * Every page is the same shape now, right down to the image count: hero
 * plus one image, two reading paragraphs, no exceptions and no branches.
 *
 * The page mounts already in its service's colour world: `--hue` for the
 * things that are not text (the CTA border, hairline accents, the NEXT
 * underline) and `--hue-text` for the one hue-tinted string on the page,
 * the index numeral. That pair is the lock; see §15.
 */

const strip = (s) => s.replace(/\.webp$/, "");

/* Titles are authored as line arrays so the mask wrapper exists in the
   markup and the reveal cannot reflow on hydration — same as the studio
   page's headline. */
function Title({ parts, em }) {
  return (
    <span className="er-line">
      <span>
        {parts.map((part, i) =>
          i === em ? <em key={i}>{part}</em> : <span key={i}>{part}</span>
        )}
      </span>
    </span>
  );
}

export default function ServicePage({ service }) {
  const next = nextOf(service.slug);
  const heroBase = strip(service.hero.src);

  return (
    <div
      className="er er-svc"
      style={{ "--hue": service.hue, "--hue-text": service.hueText }}
    >
      <ServiceHeroPreload base={heroBase} sizes="100vw" />

      {/* Runs during parse, before first paint, so the entrance states are
          armed before anything is drawn rather than after — otherwise the
          page shows itself finished and then hides itself to animate in.
          Under reduced motion the class is never added, which leaves a
          complete static document, and the same is true with no JS. */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "(function(){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;document.documentElement.classList.add('er-js');}catch(e){}})()",
        }}
      />
      <ServiceMotion />

      <a className="er-skip" href="#er-main">
        Skip to content
      </a>

      <StudioHeader />

      <main id="er-main">
        {/* ------------------------------ hero ---------------------- */}
        <section className="er-svchero">
          <ServicePicture
            base={heroBase}
            alt={service.hero.alt}
            sizes="100vw"
            width={1600}
            height={2000}
            eager
            imgClassName="er-svchero__img"
            className="er-svchero__pic"
          />
          <span className="er-svchero__veil" data-svc-veil aria-hidden="true" />
          <div className="er-svchero__body">
            <div className="er-wrap">
              <p className="er-label er-svchero__n" data-svc-track>
                {service.n}
              </p>
              <h1
                className="er-display er-svchero__t"
                data-svc-title
              >
                <Title parts={service.title} em={service.em} />
              </h1>
            </div>
          </div>
        </section>
        <div className="er-wrap">
          <span
            className="er-svchero__rule"
            data-svc-herorule
            aria-hidden="true"
          />
        </div>

        {/* ------------------------- the reading -------------------- */}
        {/* The text serif, and the only place on the page it appears. Not
            wrapped in `data-svc-fade`: these paragraphs have their own
            scrubbed fill and must not also be faded in as a block, or the
            two would fight over the same opacity. */}
        <section className="er-svc__block" data-svc-block>
          <div className="er-wrap">
            <div className="er-svc__col">
              <ReadingText text={service.paragraph} />
              <ReadingText text={service.paragraph2} />
            </div>
          </div>
        </section>

        {/* ----------------------------- chips ---------------------- */}
        <section className="er-svc__block" data-svc-block>
          <div className="er-wrap">
            <div className="er-svc__col">
              <ul className="er-svc__chips">
                {service.chips.map((c) => (
                  <li key={c} className="er-label" data-svc-fade>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* --------------------------- image two -------------------- */}
        <section className="er-svc__block" data-svc-block>
          <div className="er-wrap">
            <figure className="er-svcfig er-svc__wide">
              <div className="er-svcfig__mask" data-svc-mask>
                <ServicePicture
                  base={strip(service.img2.src)}
                  alt={service.img2.alt}
                  sizes="(max-width: 1000px) 92vw, 960px"
                  width={1600}
                  height={2000}
                />
              </div>
            </figure>
          </div>
        </section>

        {/* -------------------------- keep ready -------------------- */}
        <section className="er-svc__block" data-svc-block>
          <div className="er-wrap">
            <div className="er-svc__col">
              <details className="er-svcdisc">
                <summary className="er-label er-svcdisc__sum">
                  What to keep ready
                  <span className="er-svcdisc__sign" aria-hidden="true">
                    +
                  </span>
                </summary>
                <div className="er-svcdisc__wrap">
                  <div className="er-svcdisc__inner">
                    <ul className="er-svcdisc__list">
                      {service.keepReady.map((k) => (
                        <li key={k}>{k}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* ------------------------ practical line ------------------ */}
        <section className="er-svc__block" data-svc-block>
          <div className="er-wrap">
            <div className="er-svc__col">
              <p className="er-label er-svc__practical" data-svc-fade>
                {PRACTICAL}
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------ CTA ----------------------- */}
        <section className="er-svc__block" data-svc-block>
          <div className="er-wrap">
            <div className="er-svc__cta">
              <a
                className="er-label er-svc__call"
                href={PHONE_HREF}
                data-svc-fade
              >
                Speak to a valuer
                <span aria-hidden="true">·</span>
                {PHONE}
              </a>
              <a
                className="er-label er-svc__wa"
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                data-svc-fade
              >
                WhatsApp <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* -------------------------- next service ------------------ */}
        <section className="er-svc__block" data-svc-block>
          <div className="er-wrap">
            <Link
              className="er-label er-svcnext"
              href={`/services/${next.slug}`}
              style={{ "--next-hue": next.hue }}
            >
              <span className="er-svcnext__line" data-svc-fade>
                Next — {next.plain} <span aria-hidden="true">→</span>
              </span>
            </Link>
          </div>
        </section>
      </main>

      <StudioFooter />
    </div>
  );
}
