"use client";

import { useState } from "react";
import Image from "next/image";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.target;
    const formData = new FormData(form);

    try {
      const res = await fetch(
        "https://formspree.io/f/mdagpvaa", // 🔴 REPLACE
        {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        }
      );

      if (res.ok) {
        setSuccess(true);
        form.reset();
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center py-12 px-4">
      <div className="grid md:grid-cols-2 md:gap-10 lg:gap-20 max-w-7xl w-full items-center">

        {/* LEFT */}
        <div className="p-5">
          <h1 className="text-4xl md:text-5xl font-semibold text-linen mb-3">
            Get in Touch
          </h1>

          <p className="text-lg text-fog mb-8 max-w-md">
            Have a valuation requirement or query?  
            Our experts at <strong>S S Adhau Valuers and Engineers</strong> are ready to help.
          </p>

          {/* SUCCESS MESSAGE */}
          {success && (
            <div className="mb-6 p-4 rounded-lg bg-green-900/30 text-green-300 text-sm">
              ✅ Thank you! Your message has been sent successfully.
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-900/30 text-red-300 text-sm">
              ❌ {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot field (spam protection) */}
            <input
              type="text"
              name="_gotcha"
              className="hidden"
              tabIndex="-1"
              autoComplete="off"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                name="firstName"
                placeholder="First name"
                required
                className="w-full px-3 py-3 rounded-lg text-sm bg-white/[0.05] border border-[rgba(242,239,233,0.15)] text-linen placeholder:text-fog/70 focus:border-brass outline-none"
              />
              <input
                name="lastName"
                placeholder="Last name"
                required
                className="w-full px-3 py-3 rounded-lg text-sm bg-white/[0.05] border border-[rgba(242,239,233,0.15)] text-linen placeholder:text-fog/70 focus:border-brass outline-none"
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              className="w-full px-3 py-3 rounded-lg text-sm bg-white/[0.05] border border-[rgba(242,239,233,0.15)] text-linen placeholder:text-fog/70 focus:border-brass outline-none"
            />

            {/* 🇮🇳 Indian phone validation */}
            <input
              type="tel"
              name="phone"
              placeholder="Phone (10-digit Indian number)"
              pattern="^[6-9]\d{9}$"
              title="Enter a valid 10-digit Indian mobile number"
              required
              className="w-full px-3 py-3 rounded-lg text-sm bg-white/[0.05] border border-[rgba(242,239,233,0.15)] text-linen placeholder:text-fog/70 focus:border-brass outline-none"
            />

            <textarea
              name="message"
              rows="4"
              placeholder="Your message"
              required
              className="w-full px-3 py-3 rounded-lg text-sm bg-white/[0.05] border border-[rgba(242,239,233,0.15)] text-linen placeholder:text-fog/70 focus:border-brass outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brass hover:bg-[#b58e50] text-noir font-semibold rounded-full text-sm flex items-center justify-center gap-2 disabled:opacity-70 transition-colors"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative min-h-[620px] hidden md:flex rounded-3xl overflow-hidden">
          <Image
          src="/images/law.jpg"
            alt="Contact"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
