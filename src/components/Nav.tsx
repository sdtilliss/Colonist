import Link from "next/link";

export function Nav() {
  return (
    <header className="sticky top-0 z-10 border-b border-ink-900/10 bg-parchment-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:flex-nowrap sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="hidden text-xl sm:inline" aria-hidden>
            🪵🧱🐑🌾🪨
          </span>
          <span className="whitespace-nowrap font-display text-lg font-semibold tracking-tight text-ink-900">
            Colonist Tracker
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium text-ink-800">
          <Link
            href="/"
            className="rounded-full px-3 py-1.5 transition hover:bg-ink-900/5"
          >
            Dashboard
          </Link>
          <Link
            href="/history"
            className="rounded-full px-3 py-1.5 transition hover:bg-ink-900/5"
          >
            History
          </Link>
          <Link
            href="/record"
            className="ml-1 whitespace-nowrap rounded-full bg-brick-500 px-4 py-1.5 text-white shadow-card transition hover:bg-brick-600"
          >
            Record Game
          </Link>
        </nav>
      </div>
    </header>
  );
}
