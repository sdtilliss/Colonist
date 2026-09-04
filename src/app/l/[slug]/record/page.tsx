import { notFound } from "next/navigation";
import { getLeagueMeta } from "@/lib/leagues";
import { RecordView } from "@/app/_views/RecordView";

export const dynamic = "force-dynamic";

export default async function LeagueRecordPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = await getLeagueMeta(slug);
  if (!meta) notFound();

  return <RecordView leagueSlug={slug} />;
}
