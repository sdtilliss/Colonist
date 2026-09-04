import Link from "next/link";
import { HexBoard } from "@/components/HexBoard";

export default function LeagueNotFound() {
  return (
    <div className="mx-auto max-w-md space-y-6 text-center">
      <HexBoard className="mx-auto h-28 w-28" />
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          We can&rsquo;t find that league
        </h1>
        <p className="mt-2 text-sm text-ink-800/60">
          This link doesn&rsquo;t match any league — it may be mistyped, or it might not
          exist yet.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/new"
          className="inline-flex items-center gap-2 rounded-full bg-brick-500 px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-brick-600"
        >
          Create a League
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-ink-900/15 px-5 py-2.5 text-sm font-medium text-ink-800 transition hover:bg-ink-900/5"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
