"use client";

import { useId, useRef, useState } from "react";

/* THE FORM.
 *
 * Hairline-underline fields, a honeypot, client-side validation that
 * announces itself, and a submit that posts JSON to /api/contact.
 *
 * DELIVERY IS A STUB. See src/app/api/contact/route.js — the route
 * validates and logs and returns success, and no message reaches a human
 * until a mail service is chosen. Flagged in §15 as a launch blocker. The
 * UI does not pretend otherwise anywhere it can be read as a promise: the
 * success line says a valuer will call, which is what the phone number
 * beneath the form is for.
 *
 * Errors are `--hue-03-text`, not red: the colour-worlds lock says any
 * tinted TEXT uses the `-text` variant, and a saturated red on graphite
 * measures under the floor. The error is also announced, not only
 * coloured — `aria-describedby` ties each message to its field and the
 * summary is a live region.
 */

/* the order the fields appear in, which is the order an error is hunted in */
const ORDER = ["name", "email", "phone", "message"];

const FIELDS = [
  { name: "name", label: "Name", type: "text", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel", optional: true },
];

export default function ContactForm() {
  const uid = useId();
  const [values, setValues] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState("idle"); // idle | sending | sent | failed
  const trapRef = useRef(null);

  const validate = (v) => {
    const e = {};
    if (!v.name.trim()) e.name = "Tell us who you are.";
    if (!v.email.trim()) e.email = "We need an address to reply to.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()))
      e.email = "That address does not look complete.";
    if (!v.message.trim()) e.message = "Describe the asset and the purpose.";
    return e;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate(values);
    setErrors(e);
    if (Object.keys(e).length) {
      /* Focus the first field that needs attention rather than leaving the
         reader to hunt for the line. Found by id, not by a ref chosen
         during render: a ref assigned from the errors object is read while
         rendering, which is exactly the pattern React tells you not to
         write — and it would read the PREVIOUS render's errors anyway. */
      const first = ORDER.find((n) => e[n]);
      if (first) document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company: trapRef.current?.value || "" }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setState("sent");
        setValues({ name: "", email: "", phone: "", message: "" });
      } else {
        setErrors(data.errors || {});
        setState("failed");
      }
    } catch {
      setState("failed");
    }
  };

  if (state === "sent") {
    return (
      <div className="er-form__done" role="status">
        <p className="er-form__donehead">Received. A valuer will call.</p>
        <p className="er-form__donebody">
          If it is urgent, the number below reaches the office directly.
        </p>
      </div>
    );
  }

  const field = (f) => {
    const id = `${uid}-${f.name}`;
    const err = errors[f.name];
    return (
      <p className="er-field" key={f.name}>
        <label className="er-label er-field__label" htmlFor={id}>
          {f.label}
          {f.optional ? <span className="er-field__opt"> (optional)</span> : null}
        </label>
        <input
          id={id}
          name={f.name}
          type={f.type}
          autoComplete={f.autoComplete}
          className="er-field__input"
          value={values[f.name]}
          aria-invalid={err ? "true" : undefined}
          aria-describedby={err ? `${id}-err` : undefined}
          onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
        />
        {err ? (
          <span className="er-field__err" id={`${id}-err`}>
            {err}
          </span>
        ) : null}
      </p>
    );
  };

  const mid = `${uid}-message`;
  return (
    <form className="er-form" onSubmit={onSubmit} noValidate>
      {FIELDS.map(field)}

      {/* the message takes the full width of the form's row of three */}
      <p className="er-field er-field--wide">
        <label className="er-label er-field__label" htmlFor={mid}>
          Message
        </label>
        <textarea
          id={mid}
          name="message"
          rows={4}
          className="er-field__input er-field__area"
          value={values.message}
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? `${mid}-err` : undefined}
          onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
        />
        {errors.message ? (
          <span className="er-field__err" id={`${mid}-err`}>
            {errors.message}
          </span>
        ) : null}
      </p>

      {/* the honeypot: off-screen, not `display:none` — a bot that reads
          the stylesheet skips a hidden field and fills a visible one */}
      <div className="er-form__trap" aria-hidden="true">
        <label htmlFor={`${uid}-company`}>Company</label>
        <input
          id={`${uid}-company`}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          ref={trapRef}
        />
      </div>

      <div className="er-form__foot">
        <button
          type="submit"
          className="er-label er-form__submit"
          disabled={state === "sending"}
        >
          {state === "sending" ? "Sending" : "Send message"}
          <span aria-hidden="true"> →</span>
        </button>
        <p className="er-form__live" role="status">
          {state === "failed"
            ? "That did not send. Call the number below and we will pick it up."
            : ""}
        </p>
      </div>
    </form>
  );
}
