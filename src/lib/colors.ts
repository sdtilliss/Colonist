const PALETTE = [
  { bg: "bg-brick-500", text: "text-white", ring: "ring-brick-600" },
  { bg: "bg-wood-500", text: "text-white", ring: "ring-wood-600" },
  { bg: "bg-wheat-500", text: "text-white", ring: "ring-wheat-600" },
  { bg: "bg-ore-500", text: "text-white", ring: "ring-ore-700" },
  { bg: "bg-sheep-500", text: "text-ink-900", ring: "ring-sheep-500" },
  { bg: "bg-teal-500", text: "text-white", ring: "ring-teal-600" },
  { bg: "bg-plum-500", text: "text-white", ring: "ring-plum-600" },
  { bg: "bg-rust-500", text: "text-white", ring: "ring-rust-600" },
  { bg: "bg-indigo-500", text: "text-white", ring: "ring-indigo-600" },
];

// The group's known roster gets a guaranteed-distinct color each. Anyone new
// falls back to a hash below, which can't make that same guarantee but keeps
// colors stable per name.
const KNOWN_ROSTER = ["Gorgon", "Quan", "Hoss", "Bal", "Seth", "Tyler", "Bhung", "Brungus", "Rian"];

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function playerColor(name: string) {
  const knownIndex = KNOWN_ROSTER.indexOf(name);
  if (knownIndex !== -1) return PALETTE[knownIndex % PALETTE.length];
  return PALETTE[hashName(name) % PALETTE.length];
}

export function initials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}
