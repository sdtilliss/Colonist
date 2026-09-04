import Link from "next/link";
import { HexBoard } from "@/components/HexBoard";

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <section className="relative overflow-hidden rounded-3xl border border-ink-900/10 bg-white shadow-lift">
        <div className="grid gap-6 p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-10">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-brick-600">
              Colonist Tracker
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
              Track your Catan wins, as a group.
            </h1>
            <p className="mt-3 max-w-lg text-sm text-ink-800/70 sm:text-base">
              Every group gets its own private leaderboard, game log, and stats — record
              results manually or by uploading a Colonist.io screenshot. No accounts, just
              a link you share with your table.
            </p>
            <Link
              href="/new"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-brick-500 px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-brick-600"
            >
              Create a League
            </Link>
          </div>
          <HexBoard className="h-40 w-40 justify-self-center sm:h-48 sm:w-48" />
        </div>
      </section>

      <p className="mt-6 text-center text-sm text-ink-800/50">
        Already have a league? Use the link your group shared — each league lives at its
        own <code className="rounded bg-ink-900/5 px-1.5 py-0.5">/l/&#123;your-league&#125;</code> address.
      </p>
    </div>
  );
}
