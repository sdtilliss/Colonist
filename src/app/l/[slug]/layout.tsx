import { notFound } from "next/navigation";
import { getLeagueMeta } from "@/lib/leagues";

export default async function LeagueLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = await getLeagueMeta(slug);
  if (!meta) notFound();

  return children;
}
