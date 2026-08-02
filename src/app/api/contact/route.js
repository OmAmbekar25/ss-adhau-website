/* THE SUBMISSION TARGET — a stub, and it says so.
 *
 * TODO(client) — DELIVERY IS NOT WIRED. This route accepts the form,
 * validates it, logs it to the server console and returns success. It does
 * NOT send an email, write to a database or reach any third party, because
 * no SMTP account, transactional-email service or CRM has been chosen yet.
 * A message submitted against this route is READ BY NOBODY.
 *
 * The legacy page posted to a Formspree endpoint marked "🔴 REPLACE" in the
 * source — someone else's demo form, live on a client site. That is worse
 * than a stub, because it looks like it works. This one is honest in the
 * logs and flagged in §15 as a launch blocker.
 *
 * TO GO LIVE: pick a service (Resend, Postmark, SES, or the firm's own
 * SMTP), add the credential to the environment, and replace the marked
 * block below with the send call. Nothing else here needs to change — the
 * validation, the honeypot and the response shape are already what a real
 * handler would use.
 */

export const runtime = "nodejs";

const MAX = { name: 120, email: 160, phone: 40, message: 4000 };

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const message = String(body.message || "").trim();
  /* the honeypot: a field no human sees and no human fills */
  const trap = String(body.company || "").trim();

  if (trap) {
    /* answer as though it worked — a bot that learns it failed tries again */
    return Response.json({ ok: true });
  }

  const errors = {};
  if (!name) errors.name = "Tell us who you are.";
  else if (name.length > MAX.name) errors.name = "That name is too long.";
  if (!email) errors.email = "We need an address to reply to.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    errors.email = "That address does not look complete.";
  else if (email.length > MAX.email) errors.email = "That address is too long.";
  if (phone && phone.length > MAX.phone) errors.phone = "That number is too long.";
  if (!message) errors.message = "Describe the asset and the purpose.";
  else if (message.length > MAX.message) errors.message = "That message is too long.";

  if (Object.keys(errors).length) {
    return Response.json({ ok: false, errors }, { status: 422 });
  }

  /* ------------------------------------------------------------------
     TODO(client): REPLACE THIS BLOCK WITH A REAL SEND.
     Until then the enquiry exists only in the server log.
     ------------------------------------------------------------------ */
  console.warn(
    "[contact] NOT DELIVERED — no mail service configured. Enquiry:",
    JSON.stringify({ name, email, phone, message: message.slice(0, 400) })
  );

  return Response.json({ ok: true });
}
