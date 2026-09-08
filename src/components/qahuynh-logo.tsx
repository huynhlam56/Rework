export function QahuynhLogo({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="qahuynh logo"
    >
      <defs>
        <linearGradient id="qahuynh-badge" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
        <clipPath id="qahuynh-clip">
          <circle cx="50" cy="50" r="50" />
        </clipPath>
      </defs>

      <circle cx="50" cy="50" r="50" fill="url(#qahuynh-badge)" />

      <g clipPath="url(#qahuynh-clip)" fill="#1c1023" fillOpacity="0.92">
        <ellipse cx="50" cy="107" rx="34" ry="29" />
        <ellipse cx="29" cy="78" rx="10" ry="21" transform="rotate(-20 29 78)" />
        <ellipse cx="71" cy="78" rx="10" ry="21" transform="rotate(20 71 78)" />
        <ellipse cx="50" cy="49" rx="23" ry="28" />
        <circle cx="50" cy="39" r="12" />
      </g>
    </svg>
  );
}
