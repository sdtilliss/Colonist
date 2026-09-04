import { getRoster } from "@/lib/store";
import { RecordTabs } from "@/app/record/RecordTabs";

export async function RecordView({ leagueSlug }: { leagueSlug?: string }) {
  const roster = await getRoster(leagueSlug);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">Record a Game</h1>
        <p className="mt-1 text-sm text-ink-800/60">
          Snap your Colonist.io results screen, or log it manually. Stats update instantly.
        </p>
      </div>
      <div className="rounded-2xl border border-ink-900/10 bg-white p-6 shadow-card">
        <RecordTabs roster={roster} leagueSlug={leagueSlug} />
      </div>
    </div>
  );
}
