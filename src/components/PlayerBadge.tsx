import { initials, playerColor } from "@/lib/colors";

export function PlayerBadge({
  name,
  size = "md",
  highlighted = false,
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  highlighted?: boolean;
}) {
  const color = playerColor(name);
  const dims = size === "sm" ? "h-6 w-6 text-[10px]" : size === "lg" ? "h-10 w-10 text-sm" : "h-8 w-8 text-xs";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-semibold ${color.bg} ${color.text} ${dims} ${
        highlighted ? `ring-2 ring-offset-2 ring-offset-parchment-50 ${color.ring}` : ""
      }`}
      title={name}
    >
      {initials(name)}
    </span>
  );
}

export function PlayerChip({ name, active }: { name: string; active?: boolean }) {
  const color = playerColor(name);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition ${
        active
          ? `${color.bg} ${color.text} border-transparent shadow-card`
          : "border-ink-900/10 bg-white text-ink-800"
      }`}
    >
      <PlayerBadge name={name} size="sm" />
      {name}
    </span>
  );
}
