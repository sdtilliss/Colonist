import { notFound } from "next/navigation";
import { getLeagueMeta } from "@/lib/leagues";
import { HistoryView } from "@/app/_views/HistoryView";

export const dynamic = "force-dynamic";

export default async function LeagueHistoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = await getLeagueMeta(slug);
  if (!meta) notFound();

  return <HistoryView leagueSlug={slug} />;
}
