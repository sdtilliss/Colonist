import { RecordView } from "@/app/_views/RecordView";

export const dynamic = "force-dynamic";

export default async function LeagueRecordPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <RecordView leagueSlug={slug} />;
}
