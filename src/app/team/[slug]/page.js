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
    description: `He is a Graduate in Civil Engineering from Nagpur University along with a Full time Master’s Degree in Real Estate Valuation  and Plant and Machinery Valuation from Sardar Patel University, Gujarat. He brings a strong academic foundation to the field of valuation and engineering.

He is a Member of the of the IOV Registered Valuer Foundation ( IOV RVF ). As a Registered Valuer ( Land & Building ) with the Insolvency and Bankruptcy Board of India (IBBI) under the Companies Act, 2013. He is also registered under Category I ( Immovable Properties ) with Department of Income Tax, Govt. Of India. Sunil possesses the legal and professional credentials to conduct valuations with precision and credibility. With deep expertise in valuation of structures, he has worked as an Independent Engineer for lenders, investors, and property owners, ensuring accurate assessments and strategic insights.

In S.S. Adhau Valuers & Engineers, he plays a key leadership role in managing overall business operations. A tech-savvy professional, he leverages his technological expertise to enhance business efficiency and innovation in valuation practices.`,
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
    description: `Er. Prateek Agrawal is a qualified Civil Engineer with a specialization in Structural Engineering, holding a Master’s degree (M.Tech) in the field. He possesses strong technical expertise in structural analysis, design, and evaluation of engineering assets.
He is a Chartered Engineer (C.Eng.) and a Member of the Institution of Valuers (IOV), reflecting his professional competence and commitment to industry standards.
With over 7 years of professional experience, he has developed strong capabilities in structural assessment and valuation support, contributing to accurate, reliable, and regulation-compliant engineering solutions.`,
    img: "/images/dummyuser.jpg",
  },

  {
    slug: "renuka-trivedi",
    name: "Ar. Renuka Trivedi",
    qualifications: "B.Arch.",
    role: "Associate",
    description: `Ar. Renuka Trivedi is a qualified Architect with extensive experience in planning, design, and execution of diverse architectural projects. She brings a creative yet practical approach to design, ensuring functionality, aesthetics, and compliance with regulatory standards.
With over 6 years of professional experience, she has successfully completed 500+ projects, demonstrating her efficiency, consistency, and strong project management capabilities.
She specializes in the design and planning of flat schemes, hospitals, and residential bungalows, delivering well-optimized layouts and client-focused solutions. Her expertise contributes significantly to achieving high-quality architectural outcomes across a wide range of developments.`,
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
    <div className="text-sm text-fog mb-6">
      <span className="hover:text-brass cursor-pointer"><Link href="/">Home</Link></span> 
      <span className="mx-2">/</span>
      <span className="hover:text-brass cursor-pointer"><Link href="/about">About</Link></span>
      <span className="mx-2">/</span>
      <span className="text-fog font-medium">{member.name}</span>
    </div>

    {/* 🔹 Profile Card */}
    <div className="bg-white/[0.04] border border-[rgba(242,239,233,0.1)] rounded-2xl shadow-lg p-6 md:p-10">

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
          <h1 className="text-3xl md:text-4xl font-bold text-linen">
            {member.name}
          </h1>

          <p className="text-brass mt-2 font-semibold text-lg">
            {member.role}
          </p>

          <p className="mt-3 text-fog">
            {member.qualifications}
          </p>

          {/* Highlight Box */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg border-l-4 border-brand-accent">
            <p className="text-sm text-fog">
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
  <h3 className="font-semibold text-linen mb-3">Key Information</h3>

  <div className="space-y-2 text-sm text-fog">
    <p><span className="font-medium text-gray-800">Role:</span> {member.role}</p>
    <p><span className="font-medium text-gray-800">Qualification:</span> {member.qualifications}</p>
    <p><span className="font-medium text-gray-800">Domain:</span> Valuation & Engineering</p>
  </div>
</div>

        {/* Right Content */}
        <div className="md:col-span-2 space-y-4 text-fog leading-relaxed text-justify">
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