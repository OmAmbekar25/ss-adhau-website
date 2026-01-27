import Image from "next/image";

const teamMembers = [
  { name: "John Doe", role: "Content Marketing", img: "/images/user.jpg" },
  { name: "Jane Smith", role: "SEO Specialist", img: "/images/user.jpg" },
  { name: "Rahul Verma", role: "UI/UX Designer", img: "/images/user.jpg" },
  { name: "Anita Patel", role: "Business Analyst", img: "/images/user.jpg" },
  { name: "Amit Shah", role: "Project Manager", img: "/images/user.jpg" },
  { name: "Neha Kulkarni", role: "Digital Strategist", img: "/images/user.jpg" },
];

export default function TeamSection() {
  return (
    <section className="py-16 ">
      <h1 className="text-4xl md:text-5xl font-semibold text-center mx-auto">
        Meet Our Team
      </h1>
      <div className="w-full flex justify-center mt-2">
        <div className="w-24  h-[3px] rounded-full bg-gradient-to-r from-brand-orange to-orange-100 mt-1" />
      </div>
      <p className="text-slate-500 text-lg text-center mt-2">
        The people behind the firm, driven by expertise and integrity.
      </p>

      <div className="w-full flex justify-center">
        <div
        className=" max-w-8xl  mt-12 grid grid-cols-1 gap-20  sm:grid-cols-2 lg:grid-cols-3  justify-items-center"
      >
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="w-full max-w-80 bg-black text-white rounded-2xl"
          >
            <div className="relative -mt-px overflow-hidden rounded-2xl">
              <Image
                src={member.img}
                alt={member.name}
                width={320}
                height={270}
                className="h-[270px] w-full object-cover object-top rounded-2xl hover:scale-105 transition-all duration-300"
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
        ))}
      </div>
      </div>
    </section>
  );
}
