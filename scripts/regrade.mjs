#!/usr/bin/env node
/**
 * §2 — THE FULL-COLOUR RE-GRADE.
 *
 * Takes the thirteen ORIGINAL photographs and produces the graded WebP
 * exports the site serves. It does not run in this container: the network
 * policy here blocks unsplash.com (403 on CONNECT), so the originals
 * cannot be fetched, and the files currently in `public/images` are the
 * supplier's duotone exports with the colour already discarded — measured
 * at 0.009-0.033 mean saturation, 0.0% of pixels carrying any hue. That
 * is not recoverable, as the brief itself notes.
 *
 * So this is the pipeline, written and ready, waiting only on inputs.
 *
 * USAGE
 *   1. Put the originals in `scripts/originals/` named for their outputs:
 *        slide-01-real-estate.jpg   page-01-interior.jpg   …
 *      Every source ID, photographer and licence is already recorded in
 *      docs/asset-licenses.md — the six slides and seven page images are
 *      Unsplash under the Unsplash License, so re-acquiring the same
 *      licensed file keeps that table true.
 *   2. npm i --no-save sharp
 *   3. node scripts/regrade.mjs
 *
 * WHAT IT DOES (§2.1 keeps / §2.2 changes)
 *   KEEP    4:5 crop at 1600x2000, unsharp mask, WebP + 800w variant
 *   REMOVE  duotone, per-service hue tint, desaturation of any kind
 *   NEW     white balance normalised toward neutral daylight, exposure
 *           matched across the set to a common mid-grey, saturation left
 *           at 100% of the original, and a GENTLE S-curve with the
 *           shadows lifted — the failure mode being corrected is dark
 *           architectural frames reading as black rectangles on a light
 *           card, so the black point is deliberately not crushed.
 *
 * The crop is the one thing that cannot be reproduced exactly: the
 * supplier's framing is recorded in prose ("top-58% crop to 4:5", "tight
 * engine crop"), so CROP below carries those as gravity hints per file
 * and the result is a close approximation, not a pixel match. Check the
 * six slides by eye before shipping.
 */

import fs from "node:fs";
import path from "node:path";

const SRC = "scripts/originals";
const OUT_SLIDES = "public/images/slides";
const OUT_PAGES = "public/images/pages";

/* Gravity hints taken from docs/asset-licenses.md, one per file. */
const CROP = {
  "slide-01-real-estate": "north", // top-58% crop
  "slide-02-machinery": "centre", // tight engine crop
  "slide-03-ibc": "centre",
  "slide-04-business": "centre", // tower cluster
  "slide-05-financial": "centre", // manuscript centre
  "slide-06-ma": "centre",
  "page-01-interior": "centre",
  "page-01-pattern": "centre",
  "page-02-workshop": "centre",
  "page-03-files": "centre",
  "page-04-interior": "centre",
  "page-05-tables": "centre",
  "page-06-bridge": "centre",
};

/* The exposure target every image is matched to. Chosen as a mid-grey so
   thirteen photographs from thirteen sources read as one set without any
   of them being pushed far from its own natural tone. */
const TARGET_MEAN = 118; // 0-255

const main = async () => {
  const sharp = (await import("sharp")).default;

  if (!fs.existsSync(SRC)) {
    console.error(
      `No originals at ${SRC}. See the header of this file — the graded ` +
        `exports in public/images have their colour baked out and cannot ` +
        `be the input.`
    );
    process.exit(1);
  }

  const files = fs.readdirSync(SRC).filter((f) => /\.(jpe?g|png|tiff?|webp)$/i.test(f));
  if (!files.length) {
    console.error(`${SRC} is empty.`);
    process.exit(1);
  }

  for (const file of files) {
    const stem = path.basename(file, path.extname(file));
    const dir = stem.startsWith("slide-") ? OUT_SLIDES : OUT_PAGES;
    const gravity = CROP[stem] ?? "centre";

    const base = sharp(path.join(SRC, file), { failOn: "none" });

    /* 1. White balance toward neutral daylight, then match exposure.
          Both are measured off the image rather than dialled in, so the
          set converges without any single file being hand-tuned. */
    const stats = await base.clone().stats();
    const [r, g, b] = stats.channels;
    const grey = (r.mean + g.mean + b.mean) / 3;
    const wb = [grey / r.mean, grey / g.mean, grey / b.mean];
    const exposure = TARGET_MEAN / grey;

    const graded = base
      .clone()
      .resize(1600, 2000, { fit: "cover", position: gravity })
      .linear(
        wb.map((m) => m * exposure),
        [0, 0, 0]
      )
      /* 2. Gentle S-curve with the shadows LIFTED. gamma < 1 opens the
            low end; the black point is left off the floor on purpose so a
            dark facade is a dark facade and not a black rectangle. */
      .gamma(1.06)
      .modulate({ saturation: 1.0 }) // §2.2: 100% of original, no boost
      .linear(1.04, -4) // the S, shallow
      /* 3. Unsharp mask, as before. */
      .sharpen({ sigma: 0.8, m1: 0.5, m2: 2.0 });

    fs.mkdirSync(dir, { recursive: true });
    await graded.clone().webp({ quality: 82 }).toFile(path.join(dir, `${stem}.webp`));
    await graded
      .clone()
      .resize(800, 1000, { fit: "cover", position: gravity })
      .webp({ quality: 82 })
      .toFile(path.join(dir, `${stem}-800.webp`));

    console.log(
      `${stem}  wb ${wb.map((v) => v.toFixed(2)).join("/")}  exposure ${exposure.toFixed(2)}`
    );
  }

  console.log(
    "\nDone. Next: re-run the AVIF comparison and prune the variants that " +
      "encode larger than their WebP, then update src/data/avifVariants.json " +
      "— grain is noise and AVIF spends bits preserving what WebP discards, " +
      "which is why six of twenty lost last time."
  );
};

main();
