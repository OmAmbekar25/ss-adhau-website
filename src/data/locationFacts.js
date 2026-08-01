/* U-4 (optional, additive) — the distance line on service-area cards.
 *
 * OFF BY DEFAULT. Flip `SHOW_DISTANCE_FACTS` to true to show it; nothing
 * else changes, and no existing line in the card moves either way.
 *
 * EVERY VALUE HERE IS UNVERIFIED. They are the road-route approximations
 * that came with the territory brief, carried over unchanged, and each one
 * is marked TODO(client-verify) below. They render with "≈" so the page
 * never claims a measured distance. Do not switch the flag on for a live
 * site until the firm has confirmed the numbers — the anchor office for
 * each is named in the line, and Chhindwara–Seoni at 70km is the one worth
 * checking first.
 */

export const SHOW_DISTANCE_FACTS = false;

export const FACTS = {
  Pandhurna: "≈ 95 km from Chhindwara", // TODO(client-verify)
  Betul: "≈ 125 km from Chhindwara", // TODO(client-verify)
  Seoni: "≈ 70 km from Chhindwara", // TODO(client-verify)
  Balaghat: "≈ 170 km from Nagpur", // TODO(client-verify)
  Jabalpur: "≈ 215 km from Chhindwara", // TODO(client-verify)
  Bhopal: "≈ 290 km from Chhindwara", // TODO(client-verify)
  Indore: "≈ 430 km from Chhindwara", // TODO(client-verify)
};
