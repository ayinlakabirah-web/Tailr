export function FashionIllustration() {
  return (
    <svg
      width="100%"
      height="auto"
      viewBox="0 0 400 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ maxWidth: "400px", height: "auto" }}
      role="img"
      aria-label="Fashion design illustration"
    >
      {/* Dress form / mannequin silhouette */}
      <path
        d="M200 40c-11 0-20 9-20 20v20h40V60c0-11-9-20-20-20z"
        fill="hsl(256, 34%, 48%)"
        opacity="0.15"
      />
      <path
        d="M160 120c0 0-20 40-30 80s-10 80-10 80l30 10s10-60 20-100 10-60 10-60"
        fill="hsl(256, 34%, 48%)"
        opacity="0.1"
      />
      <path
        d="M240 120c0 0 20 40 30 80s10 80 10 80l-30 10s-10-60-20-100-10-60-10-60"
        fill="hsl(256, 34%, 48%)"
        opacity="0.1"
      />

      {/* Mannequin body */}
      <rect x="180" y="80" width="40" height="60" rx="8" fill="hsl(256, 34%, 48%)" opacity="0.08" />

      {/* Tape measure draped around neck */}
      <path
        d="M140 100c0 0 20-10 60-10s60 10 60 10"
        stroke="hsl(256, 34%, 48%)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.4"
      />

      {/* Scissors */}
      <g transform="translate(60, 360)">
        <ellipse cx="12" cy="0" rx="12" ry="6" fill="none" stroke="hsl(256, 34%, 48%)" strokeWidth="2.5" opacity="0.5" />
        <ellipse cx="12" cy="20" rx="12" ry="6" fill="none" stroke="hsl(256, 34%, 48%)" strokeWidth="2.5" opacity="0.5" />
        <line x1="22" y1="6" x2="40" y2="40" stroke="hsl(256, 34%, 48%)" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
        <line x1="22" y1="14" x2="40" y2="40" stroke="hsl(256, 34%, 48%)" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
      </g>

      {/* Sewing needle */}
      <line x1="280" y1="370" x2="310" y2="310" stroke="hsl(256, 34%, 48%)" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
      <circle cx="280" cy="373" r="5" fill="none" stroke="hsl(256, 34%, 48%)" strokeWidth="2" opacity="0.5" />

      {/* Thread line */}
      <path
        d="M280 376c-10 20-5 40 10 50s20 30 10 50"
        stroke="hsl(256, 34%, 48%)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.3"
      />

      {/* Buttons scattered */}
      <circle cx="100" cy="250" r="8" fill="hsl(256, 34%, 48%)" opacity="0.12" />
      <circle cx="108" cy="248" r="3" fill="hsl(256, 34%, 48%)" opacity="0.08" />
      <circle cx="300" cy="200" r="8" fill="hsl(256, 34%, 48%)" opacity="0.12" />
      <circle cx="308" cy="198" r="3" fill="hsl(256, 34%, 48%)" opacity="0.08" />

      {/* Fashion sketch / dress outline */}
      <path
        d="M170 140c-10 20-30 80-30 140 0 0 10 20 30 20s30-10 30-30-10-20-10-40c0-30 10-60 10-60"
        stroke="hsl(256, 34%, 48%)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.2"
      />
      <path
        d="M230 140c10 20 30 80 30 140 0 0-10 20-30 20s-30-10-30-30 10-20 10-40c0-30-10-60-10-60"
        stroke="hsl(256, 34%, 48%)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.2"
      />

      {/* Ruler */}
      <rect x="310" y="280" width="4" height="80" rx="2" fill="hsl(256, 34%, 48%)" opacity="0.25" />
      <line x1="310" y1="300" x2="314" y2="300" stroke="hsl(256, 34%, 48%)" strokeWidth="1.5" opacity="0.3" />
      <line x1="310" y1="320" x2="314" y2="320" stroke="hsl(256, 34%, 48%)" strokeWidth="1.5" opacity="0.3" />
      <line x1="310" y1="340" x2="314" y2="340" stroke="hsl(256, 34%, 48%)" strokeWidth="1.5" opacity="0.3" />

      {/* Dotted pattern lines (fabric texture) */}
      <circle cx="120" cy="420" r="2" fill="hsl(256, 34%, 48%)" opacity="0.15" />
      <circle cx="140" cy="420" r="2" fill="hsl(256, 34%, 48%)" opacity="0.15" />
      <circle cx="160" cy="420" r="2" fill="hsl(256, 34%, 48%)" opacity="0.15" />
      <circle cx="120" cy="440" r="2" fill="hsl(256, 34%, 48%)" opacity="0.15" />
      <circle cx="140" cy="440" r="2" fill="hsl(256, 34%, 48%)" opacity="0.15" />
      <circle cx="160" cy="440" r="2" fill="hsl(256, 34%, 48%)" opacity="0.15" />

      {/* Pin */}
      <line x1="190" y1="220" x2="210" y2="200" stroke="hsl(256, 34%, 48%)" strokeWidth="1.5" opacity="0.4" />
      <circle cx="210" cy="198" r="4" fill="hsl(256, 34%, 48%)" opacity="0.4" />

      {/* Brand name watermark */}
      <text
        x="200"
        y="460"
        textAnchor="middle"
        fill="hsl(256, 34%, 48%)"
        opacity="0.06"
        fontSize="36"
        fontWeight="700"
        fontFamily="Inter, sans-serif"
        letterSpacing="4"
      >
        TAILR
      </text>
    </svg>
  );
}
