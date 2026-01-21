import Image from "next/image";
import Link from "next/link";
import SSAdhauLogo from "@/app/assets/images/SSAdhauBG.png";


export default function Footer() {
  return (
    <footer className="bg-brand-light border border-t-gray-300 mt-10 px-6 md:px-16 lg:px-24 xl:px-32 pt-12 text-brand-slate">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between gap-10 border-b border-slate-300 pb-8">
        {/* Logo + Description */}
        <div className="md:max-w-sm">
          <Link href="/" aria-label="Go to homepage">
            <Image
              src={SSAdhauLogo}
              alt="Company Logo"
              width={160}
              height={40}
              className="object-contain"
              priority
            />
          </Link>

          <p className="mt-6 text-md leading-relaxed">
            Professional valuation services delivering accuracy, compliance,
            and reliability across real estate, financial reporting, and
            regulatory requirements.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-1 flex-wrap gap-16 md:justify-end">
          {/* Company */}
          <div>
            <h3 className="font-semibold mb-5 text-brand-navy">Company</h3>
            <ul className="space-y-2 text-md">
              <li>
                <Link href="/" className="hover:text-brand-orange">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-orange">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-brand-orange">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-orange">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-brand-orange">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-5 text-brand-navy">
              Get in Touch
            </h3>
            <div className="space-y-2 text-md">
              <a
                href="tel:+12124567890"
                className="block hover:text-brand-orange"
              >
                +91 8793000929
              </a>
              <a
                href="mailto:contact@example.com"
                className="block hover:text-brand-orange"
              >
                ssadhauvaluers@gmail.com
              </a>
              {/* <p>
                F 02,First Floor,Jail Bagicha Complex,Above Pasha Travels,
              </p> */}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <p className="py-5 text-center text-md md:text-lg">
        © {new Date().getFullYear()}{" "}
        <a
          href="https://prebuiltui.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-brand-orange"
        >
          SS Adhau Valuers & Engineers
        </a>
        . All rights reserved.
      </p>
    </footer>
  );
}
