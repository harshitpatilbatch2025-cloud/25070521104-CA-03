import { useId } from 'react';
import { Link } from 'react-router-dom';

export function LogoMark({ size = 42 }) {
  const rawId = useId();
  const gradientId = `shield-${rawId.replace(/:/g, '')}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label="ScamShield shield logo"
      className="logo-mark"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="0.55" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      <path
        d="M24 3.5 42.5 10v13.2c0 10.7-7.2 19.2-18.5 23.3C12.7 42.4 5.5 33.9 5.5 23.2V10z"
        fill={`url(#${gradientId})`}
      />
      <path
        d="M24 8.4 37.6 13.6v9.4c0 8-5.4 14.5-13.6 18-8.2-3.5-13.6-10-13.6-18v-9.4z"
        fill="#06101f"
        opacity="0.16"
      />
      <path
        d="m15.8 24.1 5.4 5.4L32.5 17"
        fill="none"
        stroke="#04121c"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Logo({ to = '/', compact = false, className = '' }) {
  return (
    <Link to={to} className={`brand ${className}`.trim()}>
      <span className="brand-mark">
        <LogoMark size={compact ? 36 : 42} />
      </span>
      <span className="brand-text">
        <span className="brand-name">
          Scam<span>Shield</span>
        </span>
        {!compact && <span className="brand-tagline">Digital fraud awareness</span>}
      </span>
    </Link>
  );
}
