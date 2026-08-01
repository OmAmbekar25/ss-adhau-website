import AVIF from "@/data/avifVariants.json";

/* A plain <picture>, not next/image.
 *
 * The exports are already at the two widths the design uses and are
 * already graded, so there is nothing for the optimiser to do but re-encode
 * work the client has done — and next/image cannot express "offer AVIF for
 * this file but not that one", which is exactly what these assets need.
 *
 * AVIF-first, but only where AVIF is actually smaller. Grain is noise, and
 * AVIF spends bits preserving noise that WebP discards: six of the twenty
 * variants encoded LARGER than the supplied WebP, by up to 22%. Those were
 * deleted, and `avifVariants.json` records the ones worth offering. A file
 * without an AVIF simply gets no AVIF source, and the browser takes the
 * WebP it would have taken anyway.
 */

const has = new Set(AVIF);

/* the supplied set is `name.webp` at 1600 and `name-800.webp` at 800 */
function sources(base) {
  const wide = base;
  const small = `${base}-800`;
  const webp = `${small}.webp 800w, ${wide}.webp 1600w`;
  const avifParts = [];
  if (has.has(small)) avifParts.push(`${small}.avif 800w`);
  if (has.has(wide)) avifParts.push(`${wide}.avif 1600w`);
  return { webp, avif: avifParts.length ? avifParts.join(", ") : null };
}

export default function ServicePicture({
  base,
  alt,
  sizes,
  width,
  height,
  eager = false,
  className,
  imgClassName,
}) {
  const { webp, avif } = sources(base);
  return (
    <picture className={className}>
      {avif && <source type="image/avif" srcSet={avif} sizes={sizes} />}
      <source type="image/webp" srcSet={webp} sizes={sizes} />
      <img
        src={`${base}.webp`}
        alt={alt}
        width={width}
        height={height}
        className={imgClassName}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding={eager ? "sync" : "async"}
      />
    </picture>
  );
}

/* The hero is the LCP element on every one of these pages, so it gets a
   preload with the same srcset the <picture> will choose from — otherwise
   the browser does not learn about it until the markup is parsed. */
export function ServiceHeroPreload({ base, sizes }) {
  const { webp, avif } = sources(base);
  return (
    <link
      rel="preload"
      as="image"
      type={avif ? "image/avif" : "image/webp"}
      imageSrcSet={avif || webp}
      imageSizes={sizes}
      fetchPriority="high"
    />
  );
}
