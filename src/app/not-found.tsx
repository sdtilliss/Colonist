import Link from "next/link";
import { HexBoard } from "@/components/HexBoard";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md space-y-6 text-center">
      <HexBoard className="mx-auto h-28 w-28" />
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">Page not found</h1>
        <p className="mt-2 text-sm text-ink-800/60">
          That link doesn&rsquo;t lead anywhere. Head back home, or start a new league.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-brick-500 px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-brick-600"
        >
          Back home
        </Link>
        <Link
          href="/new"
          className="inline-flex items-center gap-2 rounded-full border border-ink-900/15 px-5 py-2.5 text-sm font-medium text-ink-800 transition hover:bg-ink-900/5"
        >
          Create a League
        </Link>
      </div>
    </div>
  );
}
