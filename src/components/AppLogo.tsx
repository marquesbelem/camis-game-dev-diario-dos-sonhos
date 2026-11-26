interface AppLogoProps {
  size?: number;
  className?: string;
}

export function AppLogo({ size = 40, className = "" }: AppLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient
          id="app-logo-grad"
          x1="12"
          y1="8"
          x2="116"
          y2="120"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#00B4F5" />
          <stop offset="55%" stopColor="#00A1E0" />
          <stop offset="100%" stopColor="#0077A8" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="120" height="120" rx="30" fill="url(#app-logo-grad)" />
      {/* Lua crescente dourada oficial Camis (#FFA300) */}
      <path
        d="M60 22C46.5 22 35.5 33 35.5 46.5C35.5 60 46.5 71 60 71C65.2 71 70 69.3 74 66.5C62.2 65.3 53 55.4 53 43.2C53 34.1 58.2 26.2 65.8 22.4C63.9 22.1 62 22 60 22Z"
        fill="#FFA300"
      />
      {/* Estrela guia */}
      <path
        d="M92 24L95.5 33.5L105 37L95.5 40.5L92 50L88.5 40.5L79 37L88.5 33.5L92 24Z"
        fill="#FFFFFF"
      />
      {/* Páginas abertas do Diário */}
      <path
        d="M23 79C38 71.5 55 75 64 84C73 75 90 71.5 105 79V103C90 96.5 74 99 64 107C54 99 38 96.5 23 103V79Z"
        fill="#FFFFFF"
      />
      <path
        d="M64 84V105"
        stroke="#0077A8"
        strokeOpacity="0.65"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
