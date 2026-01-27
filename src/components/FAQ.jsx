"use client";

import { useState } from "react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What valuation services does SS Adhau provide?",
      answer:
        "SS Adhau offers professional valuation services for movable, immovable, and agricultural properties, catering to banks, financial institutions, corporates, legal matters, and individual clients.",
    },
    {
      question: "Are your valuation reports compliant with legal standards?",
      answer:
        "Yes. All valuation reports are prepared in strict accordance with applicable regulatory guidelines, statutory requirements, and industry standards to ensure accuracy and legal acceptance.",
    },
    {
      question: "Who conducts the valuations?",
      answer:
        "Valuations are carried out by a team of qualified, government-registered valuers with multi-disciplinary expertise and deep understanding of technical and market-driven factors.",
    },
    {
      question: "How do you ensure accuracy in valuation?",
      answer:
        "We combine local market intelligence with technical analysis, verified data sources, and proven valuation methodologies to deliver precise and reliable valuation outcomes.",
    },
    {
      question: "Do you maintain confidentiality of client information?",
      answer:
        "Absolutely. Integrity and confidentiality are core values at SS Adhau. All client data and reports are handled with complete discretion and professional ethics.",
    },
    {
      question: "What is the typical turnaround time?",
      answer:
        "We prioritize speed without compromising quality. Most valuation assignments are completed within committed timelines, depending on the property type and complexity.",
    },
  ];

  return (
    <section className="max-w-5xl mx-auto px-4 py-16">
      <p className="text-indigo-600 text-sm font-medium text-center">
        FAQ&apos;s
      </p>

      <h2 className="text-4xl md:text-5xl font-semibold text-center mx-auto">
        Looking for answers?
      </h2>

      <p className="text-lg text-slate-500 mt-2 pb-8 text-center">
        Common questions about our valuation services, process, and expertise.
      </p>

      {faqs.map((faq, index) => (
        <div
          key={index}
          className="border-b border-slate-200 py-4 cursor-pointer"
          onClick={() =>
            setOpenIndex(openIndex === index ? null : index)
          }
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-slate-800">
              {faq.question}
            </h3>

            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`${
                openIndex === index ? "rotate-180" : ""
              } transition-transform duration-300`}
            >
              <path
                d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2"
                stroke="#1D293D"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <p
            className={`text-lg text-slate-500 transition-all duration-300 ease-in-out overflow-hidden ${
              openIndex === index
                ? "opacity-100 max-h-40 pt-4"
                : "opacity-0 max-h-0"
            }`}
          >
            {faq.answer}
          </p>
        </div>
      ))}
    </section>
  );
}
