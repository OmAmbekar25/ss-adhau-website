import Image from "next/image";
import Link from "next/link";

const teamMembers = [
  { 
    name: "Er. Sudhakar S. Adhau", 
    role: "Associate & Principal Advisor", 
    img: "/images/dummyuser.jpg",
    slug: "sudhakar-adhau"
  },
  { 
    name: "Er. Sunil Sudhakar Adhau", 
    role: "Associate", 
    img: "/images/dummyuser.jpg",
    slug: "sunil-adhau"
  },
  { 
    name: "Er. Nishigandha Sunil Adhau", 
    role: "Associate", 
    img: "/images/dummyuser.jpg",
    slug: "nishigandha-adhau"
  },
  { 
    name: "Er. Prateek Agrawal", 
    role: "Associate", 
    img: "/images/dummyuser.jpg",
    slug: "prateek-agrawal"
  },
  { 
    name: "Er. Renuka Trivedi", 
    role: "Associate", 
    img: "/images/dummyuser.jpg",
    slug: "renuka-trivedi"
  },
];

export default function TeamSection() {
  return (
    <section className="py-16 ">
      <h2 className="text-4xl md:text-5xl font-semibold text-center mx-auto">
        Meet Our Team
      </h2>
      <div className="w-full flex justify-center mt-2">
        <div className="w-24  h-[3px] rounded-full bg-gradient-to-r from-brass to-brass/10 mt-1" />
      </div>
      <p className="text-fog text-lg text-center mt-2">
        The people behind the firm, driven by expertise and integrity.
      </p>

      <div className="w-full flex justify-center">
        <div
        className=" max-w-8xl  mt-12 grid grid-cols-1 gap-20  sm:grid-cols-2 lg:grid-cols-3  justify-items-center"
      >
        {teamMembers.map((member, index) => (
  <Link
    key={index}
    href={`/team/${member.slug}`}
    className="w-full max-w-80"
  >
    <div className="bg-black text-white rounded-2xl cursor-pointer hover:scale-105 transition-all duration-300">
      
      <div className="relative overflow-hidden rounded-2xl">
        <Image
          src={member.img}
          alt={member.name}
          width={320}
          height={270}
          className="h-[270px] w-full object-cover object-top"
        />
        <div className="absolute bottom-0 z-10 h-60 w-full bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </div>

      <div className="px-4 pb-6 text-center">
        <p className="mt-4 text-lg">{member.name}</p>
        <p className="text-sm font-medium bg-gradient-to-r from-[#8B5CF6] via-[#9938CA] to-[#E0724A] text-transparent bg-clip-text">
          {member.role}
        </p>
      </div>

    </div>
  </Link>
))}
      </div>
      </div>
    </section>
  );
}
