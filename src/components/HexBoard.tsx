const RESOURCE_COLORS = [
  "#3f6b45",
  "#c1552e",
  "#a8c686",
  "#e8b93d",
  "#6e7f80",
  "#d9c08c",
  "#3f6b45",
];

function Hex({ x, y, size, fill }: { x: number; y: number; size: number; fill: string }) {
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 30);
    return `${x + size * Math.cos(angle)},${y + size * Math.sin(angle)}`;
  }).join(" ");
  return <polygon points={points} fill={fill} stroke="#faf3e3" strokeWidth="3" />;
}

export function HexBoard({ className }: { className?: string }) {
  const size = 34;
  const w = size * Math.sqrt(3);
  const h = size * 1.5;
  const coords: { x: number; y: number }[] = [];
  const cols = [0, 1, 2, 1, 0];
  cols.forEach((offset, col) => {
    const rows = 3 - offset;
    for (let row = 0; row < rows; row++) {
      coords.push({
        x: 100 + col * w * 0.87,
        y: 40 + (offset * h) / 2 + row * h,
      });
    }
  });

  return (
    <svg
      viewBox="0 0 300 260"
      className={className}
      role="img"
      aria-label="Illustrated Catan-style hex board"
    >
      {coords.map((c, i) => (
        <Hex key={i} x={c.x} y={c.y} size={size} fill={RESOURCE_COLORS[i % RESOURCE_COLORS.length]} />
      ))}
    </svg>
  );
}
