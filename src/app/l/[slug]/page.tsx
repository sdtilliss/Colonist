import { notFound } from "next/navigation";
import { getLeagueMeta } from "@/lib/leagues";
import { DashboardView } from "@/app/_views/DashboardView";

export const dynamic = "force-dynamic";

export default async function LeagueDashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ recorded?: string }>;
}) {
  const { slug } = await params;
  const { recorded } = await searchParams;
  const meta = await getLeagueMeta(slug);
  if (!meta) notFound();

  return (
    <DashboardView
      leagueSlug={slug}
      leagueName={meta.name}
      since={`Tracked and tallied since ${new Date(meta.createdAt).getFullYear()}.`}
      recorded={recorded}
    />
  );
}
