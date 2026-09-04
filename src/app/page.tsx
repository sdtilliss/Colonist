import { DashboardView } from "./_views/DashboardView";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ recorded?: string }>;
}) {
  const { recorded } = await searchParams;
  return (
    <DashboardView
      leagueName="Catan Win Tracker"
      since="Tracked and tallied since 2024."
      recorded={recorded}
    />
  );
}
