import Link from "next/link";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import LearningComputerIcon from "@/icons/learning-computer.svg";
import { getAllBuildSeries } from "@/lib/content";

export function BuildIndex() {
  const series = getAllBuildSeries("en");

  return (
    <PageHeader
      icon={<LearningComputerIcon />}
      title="Learn to Build"
      description="Video series on building real projects, deep-dives into how things work, and live Q&A sessions."
    >
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-28">
        {series.map((s) => (
          <SeriesCard key={s.slug} series={s} />
        ))}
      </div>
    </PageHeader>
  );
}

function SeriesCard({
  series
}: {
  series: { slug: string; title: string; description: string; audience: string; cadence: string };
}) {
  return (
    <Link
      href={`/build/${series.slug}`}
      className="block rounded-lg border border-gray-200 bg-white p-24 hover:border-blue-300 hover:shadow-md transition-all"
    >
      <h2 className="text-xl font-semibold mb-8">{series.title}</h2>
      <p className="text-gray-600 mb-16">{series.description}</p>
      <div className="flex flex-wrap gap-8">
        {series.audience && <Pill>{series.audience}</Pill>}
        {series.cadence && <Pill>{series.cadence}</Pill>}
      </div>
    </Link>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block px-12 py-4 text-xs uppercase bg-gray-100 text-gray-700"
      style={{ fontWeight: 700, borderRadius: 12 }}
    >
      {children}
    </span>
  );
}
