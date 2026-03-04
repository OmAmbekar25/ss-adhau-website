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
    indigo: "bg-indigo-50 text-indigo-600",
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    pink: "bg-pink-50 text-pink-600",
    success: "bg-green-50 text-green-600",
  };

  return (
    <div className="border border-gray-200 rounded-2xl p-6 transition hover:shadow-lg hover:border-indigo-200 bg-white">

      {/* Top Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        {/* Title + Badge */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
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
        <div className="text-sm text-gray-500 flex flex-col sm:text-right">
          <span>{location}</span>
          <span>{type}</span>
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 text-sm text-gray-600 leading-relaxed">
        {description}
      </p>

      {/* CTA */}
      <div className="mt-6">
        <Link
          href={href}
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 transition"
        >
          Apply Now →
        </Link>
      </div>
    </div>
  );
}