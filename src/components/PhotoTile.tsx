import React from "react";
import { Icon } from "./Icon";

interface PhotoTileProps {
  label?: string;
  hasPhoto?: boolean;
  locked?: boolean;
  onClick?: () => void;
  className?: string;
  height?: number | string;
}

export const PhotoTile: React.FC<PhotoTileProps> = ({
  label,
  hasPhoto = false,
  locked = false,
  onClick,
  className = "",
  height = 140,
}) => {
  const isClickable = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      className={`rounded-[16px] flex flex-col items-center justify-center relative overflow-hidden transition-all duration-150 select-none ${
        isClickable ? "cursor-pointer active:scale-[0.98]" : ""
      } ${className}`}
      style={{
        backgroundColor: hasPhoto ? "var(--field)" : "var(--field)",
        height: typeof height === "number" ? `${height}px` : height,
      }}
    >
      {locked ? (
        <div className="flex flex-col items-center gap-1.5 text-[var(--muted)]">
          <Icon name="lock" size={24} color="var(--muted)" />
          <span className="text-[12px] font-medium">Pro</span>
        </div>
      ) : hasPhoto ? (
        <div className="flex flex-col items-center gap-2 text-[var(--muted)]">
          <Icon name="check" size={24} color="var(--accent)" />
          {label && (
            <span className="text-[12px] font-medium text-[var(--ink)]">
              {label}
            </span>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1.5 text-[var(--muted)]">
          <Icon name="camera" size={24} color="var(--placeholder)" />
          {label && (
            <span className="text-[12px] font-medium text-[var(--placeholder)]">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
