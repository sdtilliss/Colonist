import { HistoryView } from "@/app/_views/HistoryView";

export const dynamic = "force-dynamic";

export default async function LeagueHistoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <HistoryView leagueSlug={slug} />;
}
