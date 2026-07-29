import Link from "next/link";

export function JobCardSimple({
  title,
  description,
  href,
  badgeColor = "indigo",
  badgeText,
  location,
  type,
}) {
  const badgeColors = {
    indigo: "bg-indigo-50 text-brass",
    blue: "bg-brass/10 text-brass",
    orange: "bg-brass/10 text-brass",
    pink: "bg-pink-50 text-pink-600",
    success: "bg-green-50 text-green-600",
  };

  return (
    <div className="border border-[rgba(242,239,233,0.12)] rounded-2xl p-6 transition hover:shadow-lg hover:border-brass/40 bg-white/[0.04] border border-[rgba(242,239,233,0.1)]">

      {/* Top Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        {/* Title + Badge */}
        <div>
          <h3 className="text-lg font-semibold text-linen">
            {title}
          </h3>

          {badgeText && (
            <span
              className={`inline-block mt-2 text-xs font-medium px-3 py-1 rounded-full ${badgeColors[badgeColor]}`}
            >
              {badgeText}
            </span>
          )}
        </div>

        {/* Meta Info */}
        <div className="text-sm text-fog flex flex-col sm:text-right">
          <span>{location}</span>
          <span>{type}</span>
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 text-sm text-fog leading-relaxed">
        {description}
      </p>

      {/* CTA */}
      <div className="mt-6">
        <Link
          href={href}
          className="inline-flex items-center text-sm font-medium text-brass hover:text-[#dcb87a] transition"
        >
          Apply Now →
        </Link>
      </div>
    </div>
  );
}