import { notFound } from "next/navigation";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { getAllBuildSeries, getBuildSeries } from "@/lib/content";
import { SeriesPage } from "./SeriesPage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const all = getAllBuildSeries("en");
  const series = all.find((s) => s.slug === slug);
  if (!series) return {};
  return {
    title: `${series.title} - Jiki`,
    description: series.description
  };
}

export default async function BuildSeriesPage({ params }: PageProps) {
  const { slug } = await params;

  let data;
  try {
    data = await getBuildSeries(slug, "en");
  } catch {
    notFound();
  }

  return (
    <SidebarLayout activeItem="build">
      <SeriesPage series={data.series} episodes={data.episodes} />
    </SidebarLayout>
  );
}
