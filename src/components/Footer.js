import Image from "next/image";
import Link from "next/link";
// import SSAdhauLogo from "@/app/assets/images/SSAdhauBG.png";

export default function Footer() {
  return (
    <footer className="bg-noir border-t border-[rgba(242,239,233,0.12)] mt-0 px-6 md:px-12 lg:px-20 xl:px-32 pt-12 text-fog">
      {/* Top Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 border-b border-white/10 pb-10">
        {/* Logo + Description */}
        <div>
          <Link href="/" aria-label="Go to homepage">
            <Image
              src="/images/SSAdhauBG.png"
              alt="Company Logo"
              width={160}
              height={40}
              className="object-contain brightness-0 invert"
              priority
            />
          </Link>

          <p className="mt-6 text-sm leading-relaxed">
            Professional valuation services delivering accuracy, compliance, and
            reliability across real estate, financial reporting, and regulatory
            requirements.
          </p>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold mb-5 text-white">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-brass">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-brass">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-brass">
                Services
              </Link>
            </li>
            <li>
              <Link href="/locations" className="hover:text-brass">
                Locations
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-brass">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-brass">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Offices */}
        <div>
          <h3 className="font-semibold mb-5 text-white">Offices</h3>

          <div className="space-y-4 text-sm leading-relaxed">
            <div>
              <p className="font-medium">Nagpur Office:</p>
              <p>
                Plot No. 54, Panchtara Society, behind Krishna Super Market 1
                (near overbridge), Manish Nagar, Nagpur - 440015
              </p>

              <a
                href="https://maps.app.goo.gl/AJYYMS3F3ok3SajR6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-1 text-brass hover:underline text-xs"
              >
                View on Map →
              </a>
            </div>

            <div>
              <p className="font-medium">Chhindwara Office:</p>
              <p>
                F - 02, First Floor, Jail Bagicha Complex, In Front of B.S.N.L
                Office, Parasia Road, Satkar Tiraha, Chhindwara (M.P.) - 480001
              </p>

              <a
                href="https://maps.app.goo.gl/dFv8YyStPMFaygpUA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-1 text-brass hover:underline text-xs"
              >
                View on Map →
              </a>
            </div>
          </div>
        </div>

        {/* Get in Touch */}
        <div>
          <h3 className="font-semibold mb-5 text-white">Get in Touch</h3>

          <div className="space-y-3 text-sm">
            <a
              href="tel:+918793000929"
              className="block hover:text-brass"
            >
              +91 8793000929
            </a>

            <a
              href="mailto:ssadhauvaluers@gmail.com"
              className="block hover:text-brass"
            >
              ssadhauvaluers@gmail.com
            </a>

            {/* Office Timings */}
            <div className="pt-3 border-t border-white/10">
              <p className="font-medium text-white">Office Timings:</p>
              <p>Monday - Saturday: 10:00 AM - 7:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>{" "}
      
      {/* Bottom Section */}
      <p className="py-5 text-center text-sm md:text-base">
        © {new Date().getFullYear()}{" "}
        <span className="hover:text-brass">
          SS Adhau Valuers & Engineers
        </span>
        . All rights reserved.
      </p>
    </footer>
  );
}
