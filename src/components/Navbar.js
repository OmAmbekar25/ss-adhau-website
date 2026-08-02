"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
// import SSAdhauLogo from "@/app/assets/images/SSAdhauBG.png";
const itemArray = [
  { title: "Home", url: "/" },
  { title: "Services", url: "/services" },
  { title: "Locations", url: "/locations" },
  { title: "About", url: "/about" },
  { title: "Career", url: "/career" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {/* desktop */}
      <div className="flex relative h-24 bg-noir z-[100] border-b border-[rgba(242,239,233,0.1)]   text-linen md:text-lg flex-row justify-between px-6  sm:px-10 md:px-5 lg:px-5 py-3 items-center  ">
        <div className="text-primary flex  items-center  font-extrabold">
          {/* <Image src={SSAdhauLogo} width={160} height={40} className="w-16 lg:w-32 " alt="SSAdhau Logo" /> */}
          <Link href="/" className="flex items-center font-extrabold">
            <Image
              src="/images/SSAdhauBG.png"
              width={160}
              height={40}
              className="w-16 lg:w-32 brightness-0 invert"
              // the class sets width only; without `height: auto` the
              // intrinsic height is kept and the mark distorts
              style={{ height: "auto" }}
              alt="SSAdhau Logo"
            />
          </Link>
          <div className="font-bold text-xs md:text-[10px] xl:text-base text-fog">
            <p>| Chartered Engineers | Registered Valuers |</p>

            <p className="text-center text-[10px] md:text-[9px] xl:text-sm font-medium text-gray-400">
              (IBBI & Income Tax Department)
            </p>

            <p>| Architectural and Structural Consultants |</p>
          </div>
        </div>
        <ul className="hidden md:flex flex-row justify-between items-center gap-20 sm:gap-8 md:gap-4 lg:gap-20 font-semibold tracking-tight">
          {itemArray.map((x, index) => {
            return (
              <li
                key={index}
                className="hover:text-brass md:text-lg duration-200 text-linen/85"
              >
                <Link href={x.url}> {x.title}</Link>
              </li>
            );
          })}
        </ul>
        <div>
          <Link href={`/contact`}>
            <button
              type="button"
              className="text-brass hidden md:flex bg-transparent border border-brass/60 hover:bg-brass hover:text-noir focus:ring-2 focus:ring-brass/40 focus:outline-none  font-semibold rounded-full  px-6 py-2.5 text-center transition-all ease-in-out"
            >
              Get in touch
            </button>
          </Link>
        </div>
        {
          <button onClick={handleClick} className="md:hidden text-white">
            {isOpen ? (
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            )}
          </button>
        }
      </div>

      {/* Mobile */}
      <div>
        {
          <ul
            className={`flex absolute w-full z-50 bg-noir text-linen md:hidden flex-col  items-center gap-4 font-bold text-sm duration-700 overflow-hidden transition-all ${
              isOpen ? "h-56  border-b border-white/10" : "h-0"
            } `}
          >
            {itemArray.map((x, index) => {
              return (
                <li
                  key={index}
                  className="hover:text-brass duration-200 py-1 font-bold"
                >
                  <Link href={x.url} onClick={handleClick}>
                    {" "}
                    {x.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        }
      </div>
    </>
  );
};

export default Navbar;
