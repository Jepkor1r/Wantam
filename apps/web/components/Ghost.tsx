/** Sheet ghost — sits in the type, not a full-body figure. Cream + hi-vis, 2px ink. */
export function Ghost({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 88 110"
      aria-hidden="true"
      fill="none"
    >
      <path
        d="M18 48 C18 22 36 10 44 10 C52 10 70 22 70 48 L70 86 C70 86 64 78 58 86 C52 94 48 78 44 86 C40 94 36 78 30 86 C24 94 18 86 18 86 Z"
        fill="#f9f5f2"
        stroke="#000"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="34" cy="46" r="5" fill="#000" />
      <circle cx="54" cy="46" r="5" fill="#000" />
      <circle cx="36" cy="44" r="1.6" fill="#f9f5f2" />
      <circle cx="56" cy="44" r="1.6" fill="#f9f5f2" />
      <path
        d="M36 62 Q44 70 52 62"
        stroke="#000"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="28" cy="58" r="5" fill="#f4ed36" stroke="#000" strokeWidth="1.5" />
      <circle cx="60" cy="58" r="5" fill="#f4ed36" stroke="#000" strokeWidth="1.5" />
      {/* hands picking at neighboring letters */}
      <path
        d="M16 58 C6 54 2 62 8 68"
        stroke="#000"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="8" cy="70" r="6" fill="#f9f5f2" stroke="#000" strokeWidth="2" />
      <path
        d="M72 58 C82 54 86 62 80 68"
        stroke="#000"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="80" cy="70" r="6" fill="#f9f5f2" stroke="#000" strokeWidth="2" />
    </svg>
  );
}
