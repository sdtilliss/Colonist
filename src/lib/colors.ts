const PALETTE = [
  { bg: "bg-brick-500", text: "text-white", ring: "ring-brick-600", hex: "#c1552e" },
  { bg: "bg-wood-500", text: "text-white", ring: "ring-wood-600", hex: "#3f6b45" },
  { bg: "bg-wheat-400", text: "text-ink-900", ring: "ring-wheat-600", hex: "#e8b93d" },
  { bg: "bg-ore-500", text: "text-white", ring: "ring-ore-700", hex: "#6e7f80" },
  { bg: "bg-sheep-400", text: "text-ink-900", ring: "ring-sheep-500", hex: "#a8c686" },
  { bg: "bg-brick-700", text: "text-white", ring: "ring-brick-700", hex: "#7f321c" },
  { bg: "bg-wood-700", text: "text-white", ring: "ring-wood-700", hex: "#233d27" },
  { bg: "bg-wheat-600", text: "text-white", ring: "ring-wheat-600", hex: "#a87816" },
  { bg: "bg-ore-700", text: "text-white", ring: "ring-ore-700", hex: "#3a444a" },
  { bg: "bg-sheep-500", text: "text-ink-900", ring: "ring-sheep-500", hex: "#8bab66" },
];

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function playerColor(name: string) {
  return PALETTE[hashName(name) % PALETTE.length];
}

export function initials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}
