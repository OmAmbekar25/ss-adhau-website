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
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-3">
            Get in Touch
          </h1>

          <p className="text-lg text-gray-600 mb-8 max-w-md">
            Have a valuation requirement or query?  
            Our experts at <strong>SS Adhau Valuation</strong> are ready to help.
          </p>

          {/* SUCCESS MESSAGE */}
          {success && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 text-green-700 text-sm">
              ✅ Thank you! Your message has been sent successfully.
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 text-sm">
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
                className="w-full px-3 py-3 border rounded-lg text-sm focus:border-indigo-500 outline-none"
              />
              <input
                name="lastName"
                placeholder="Last name"
                required
                className="w-full px-3 py-3 border rounded-lg text-sm focus:border-indigo-500 outline-none"
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              className="w-full px-3 py-3 border rounded-lg text-sm focus:border-indigo-500 outline-none"
            />

            {/* 🇮🇳 Indian phone validation */}
            <input
              type="tel"
              name="phone"
              placeholder="Phone (10-digit Indian number)"
              pattern="^[6-9]\d{9}$"
              title="Enter a valid 10-digit Indian mobile number"
              required
              className="w-full px-3 py-3 border rounded-lg text-sm focus:border-indigo-500 outline-none"
            />

            <textarea
              name="message"
              rows="4"
              placeholder="Your message"
              required
              className="w-full px-3 py-3 border rounded-lg text-sm focus:border-indigo-500 outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-70"
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
