export default function MiniLine({ color = "green" }) {
  return (
    <svg width="80" height="24" viewBox="0 0 80 24" fill="none">
      <path
        d="M0 20 Q 20 10, 40 20 T 80 10"
        stroke={color === "green" ? "#22c55e" : "#ef4444"}
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}