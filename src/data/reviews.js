/* THE CLIENTS' OWN WORDS.
 *
 * H-2 — TODO(client), AND THIS FILE IS THE WHOLE JOB. The section that
 * reads these is already count-adaptive and needs no further work:
 *
 *   ≤ 4 reviews  →  a still two-column grid, which is what ships today
 *   ≥ 5 reviews  →  two drifting columns
 *   ≥ 9 reviews  →  the full three-column river
 *
 * So the unlock is copy, not code. Paste the firm's real list here — the
 * Google Business reviews and the written word-of-mouth, a name and one to
 * three sentences each — and the layout changes by itself.
 *
 * The four below are the only ones in the repo. Nothing here is written by
 * us; if a review is not something a client said, it does not go in.
 *
 * They lived inside StudioRiver.jsx until the reviews pass moved them out.
 * A list the client is expected to extend does not belong inside a
 * component's mechanics — the brief asks for reviews.js, and it is right:
 * one file to open, no JSX to read past.
 */
export const REVIEWS = [
  { name: "Subhash Kamti", text: "Best valuer of Chhindwara." },
  {
    name: "Prateek Agrawal",
    text: "Good knowledge. Satisfactory work. Thank you for your service sir.",
  },
  {
    name: "Priyanka Singh",
    text: "The office staff is knowledgeable and responsive.",
  },
  { name: "Anukul Singh", text: "Best." },
];

/* H-3 — the quiet line under the grid while the list is short. It borrows
 * Google's credibility honestly: it goes to the firm's own Google listing,
 * which is where these reviews are.
 *
 * TODO(client-verify): this is the head office's map pin, the same URL the
 * footer and the territory have always carried. If the firm has a direct
 * "write/see all reviews" deep link — or if the reviews sit on the
 * Chhindwara listing rather than this one — replace it. It is not invented,
 * but it is inferred, and an inference is worth confirming before launch.
 */
export const GOOGLE_REVIEWS_URL = "https://maps.app.goo.gl/AJYYMS3F3ok3SajR6";

/* The threshold the section's own rules turn on. Exported so the component
   and this file cannot disagree about what "enough to drift" means. */
export const DRIFT_MIN = 5;
