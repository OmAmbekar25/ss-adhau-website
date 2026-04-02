import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const teamMembers = [
  {
    slug: "sudhakar-adhau",
    name: "Er. Sudhakar S. Adhau",
    qualifications: "B.E. Civil, M.I.E., F.I.V, C.Eng.",
    role: "Associate & Principal Advisor",
    description: `Er. Sudhakar S. Adhau, a graduate in Civil Engineering from National Institute of Technology, Raipur is a distinguished leader in the valuation industry with decades of experience in shaping valuation practices in India.

He is a Fellow Member of Institution of Valuers, India and Member of Institution of Engineers. Additionally, he is a Category I Registered Valuer under the Wealth Tax Act (Department of Income Tax).

He is also a Chartered Engineer, further reinforcing his expertise and credibility in the field.`,
    img: "/images/dummyuser.jpg",
  },

  {
    slug: "sunil-adhau",
    name: "Er. Sunil Sudhakar Adhau",
    qualifications:
      "B.E. Civil, M.Sc. Real Estate Valuation, M.Sc. Plant & Machinery Valuation, A.M.I.E., A.I.V, C.Eng.",
    role: "Associate & Partner",
    description: `Graduate in Civil Engineering from Nagpur University with Master's degrees in Real Estate and Plant & Machinery Valuation from Sardar Patel University.

Registered Valuer (IBBI) under Companies Act, 2013 and Category I Valuer under Income Tax Department.

Plays a key leadership role in managing operations and brings strong technical and technological expertise.`,
    img: "/images/dummyuser.jpg",
  },
  {
    slug: "nishigandha-adhau",
    name: "Er. Nishigandha Sunil Adhau",
    qualifications:
      "B.E. Civil, M.Com. Real Estate Valuation",
    role: "Associate",
    description: `Er. Nishigandha Sunil Adhau is a Civil Engineer with additional specialization in Real Estate Valuation, combining technical engineering knowledge with financial and valuation expertise.

She holds a degree in Civil Engineering along with a Master’s qualification in Commerce focused on Real Estate Valuation, enabling her to approach valuation assignments with both analytical precision and regulatory understanding.

As an Associate, she contributes to valuation processes, documentation, and analysis, ensuring compliance with industry standards and delivering reliable and well-structured valuation reports. Her multidisciplinary background strengthens the firm’s ability to handle diverse valuation requirements with accuracy and professionalism.`,
    img: "/images/dummyuser.jpg",
  },

  {
    slug: "prateek-agrawal",
    name: "Er. Prateek Agrawal",
    qualifications: "B.E. Civil, M.Tech (Structural Engineering), C.Eng., M.I.O.V.",
    role: "Associate",
    description: `Specialist in Structural Engineering with over 7 years of experience.

Expert in structural analysis, design, and engineering asset evaluation. Chartered Engineer and Member of Institution of Valuers.`,
    img: "/images/dummyuser.jpg",
  },

  {
    slug: "renuka-trivedi",
    name: "Ar. Renuka Trivedi",
    qualifications: "B.Arch.",
    role: "Associate",
    description: `Experienced Architect with 6+ years of experience and 500+ completed projects.

Specializes in residential, hospital, and flat scheme designs with strong focus on functionality and compliance.`,
    img: "/images/dummyuser.jpg",
  },
];



export default async function TeamMemberPage({ params }) {
  const { slug } = await params;

  const member = teamMembers.find((m) => m.slug === slug);

  if (!member) return notFound();

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-12 py-10">

  <div className="max-w-6xl mx-auto">

    {/* 🔹 Breadcrumbs */}
    <div className="text-sm text-gray-500 mb-6">
      <span className="hover:text-brand-orange cursor-pointer"><Link href="/">Home</Link></span> 
      <span className="mx-2">/</span>
      <span className="hover:text-brand-orange cursor-pointer"><Link href="/about">About</Link></span>
      <span className="mx-2">/</span>
      <span className="text-gray-700 font-medium">{member.name}</span>
    </div>

    {/* 🔹 Profile Card */}
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">

      {/* Top Section */}
      <div className="grid md:grid-cols-3 gap-8 items-start">

        {/* Image */}
        <div className="flex justify-center md:justify-start">
          <Image
            src={member.img}
            alt={member.name}
            width={52}
            height={52}
            className="w-52 h-52 rounded-xl object-cover shadow-md"
          />
        </div>

        {/* Info */}
        <div className="md:col-span-2">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-navy">
            {member.name}
          </h1>

          <p className="text-brand-orange mt-2 font-semibold text-lg">
            {member.role}
          </p>

          <p className="mt-3 text-gray-600">
            {member.qualifications}
          </p>

          {/* Highlight Box */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg border-l-4 border-brand-orange">
            <p className="text-sm text-gray-700">
              Trusted professional with proven expertise in valuation and engineering consultancy.
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t my-8"></div>

      {/* Description Section */}
      <div className="grid md:grid-cols-3 gap-8">

        {/* Left Sticky Section (optional feel) */}
       <div className="hidden md:block">
  <h3 className="font-semibold text-brand-navy mb-3">Key Information</h3>

  <div className="space-y-2 text-sm text-gray-600">
    <p><span className="font-medium text-gray-800">Role:</span> {member.role}</p>
    <p><span className="font-medium text-gray-800">Qualification:</span> {member.qualifications}</p>
    <p><span className="font-medium text-gray-800">Domain:</span> Valuation & Engineering</p>
  </div>
</div>

        {/* Right Content */}
        <div className="md:col-span-2 space-y-4 text-gray-700 leading-relaxed text-justify">
          {member.description.split("\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

      </div>

    </div>

  </div>
</div>
  );
}