import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const wixMadefor = localFont({
  src: "./fonts/WixMadeforDisplay-VariableFont_wght.ttf",
  variable: "--font-wix-madefor",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
 title: "S S Adhau Valuers & Engineers | Chartered Engineers & Registered Valuers in Nagpur & Chhindwara",

  description:
    "S S Adhau Valuers & Engineers provides professional valuation services, chartered engineering consultancy, and structural design solutions in Nagpur and Chhindwara. Trusted for accuracy, compliance, and reliability.",

  keywords: [
    "Valuers in Nagpur",
    "Registered Valuers India",
    "Chartered Engineer Nagpur",
    "Property Valuation Nagpur",
    "Structural Engineer Chhindwara",
    "Engineering Consultancy India",
    "IBBI Registered Valuer",
    "Real Estate Valuation Services",
  ],

  authors: [{ name: "S S Adhau Valuers & Engineers" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${wixMadefor.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
