export function StatCard({
  label,
  value,
  sub,
  accent = "wood",
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  accent?: "wood" | "brick" | "wheat" | "ore" | "sheep" | "teal";
}) {
  const accentClasses: Record<string, string> = {
    wood: "border-t-wood-500",
    brick: "border-t-brick-500",
    wheat: "border-t-wheat-500",
    ore: "border-t-ore-500",
    sheep: "border-t-sheep-500",
    teal: "border-t-teal-500",
  };

  return (
    <div
      className={`rounded-2xl border border-ink-900/10 border-t-4 bg-white p-4 shadow-card ${accentClasses[accent]}`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-ink-800/60">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-ink-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-ink-800/60">{sub}</p>}
    </div>
  );
}
