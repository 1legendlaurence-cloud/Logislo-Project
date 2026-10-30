import React from "react";

interface LogoProps {
  showWordmark?: boolean;
  size?: number; // height of the logo mark
  className?: string;
  isSplash?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  showWordmark = true,
  size = 18,
  className = "",
  isSplash = false,
}) => {
  // Aspect ratio is 32/40 = 0.8
  const width = (size * 32) / 40;

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <svg
        width={width}
        height={size}
        viewBox="0 0 32 40"
        fill="var(--accent)"
        aria-hidden="true"
        className="shrink-0 overflow-visible"
      >
        <g className="l-bar">
          <rect x="0" y="0" width="10" height="40" />
        </g>
        <g className="l-foot">
          <polygon points="10,30 32,30 26,40 10,40" />
        </g>
      </svg>
      {showWordmark && (
        <span
          className={`font-semibold text-[15px] tracking-tight ${
            isSplash ? "l-wordmark" : ""
          }`}
          style={{ color: "var(--ink)" }}
        >
          Logislo
        </span>
      )}
    </div>
  );
};
