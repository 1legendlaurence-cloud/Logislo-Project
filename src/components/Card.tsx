import React from "react";
import { Icon, IconName } from "./Icon";

interface TileProps {
  label: string;
  value: string | number;
  onClick?: () => void;
  className?: string;
  muted?: boolean;
}

export const Tile: React.FC<TileProps> = ({
  label,
  value,
  onClick,
  className = "",
  muted = false,
}) => {
  const isClickable = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-[16px] flex flex-col justify-between transition-all duration-150 select-none ${
        isClickable ? "cursor-pointer active:scale-[0.98]" : ""
      } ${className}`}
      style={{
        backgroundColor: "var(--surface)",
        boxShadow: "var(--shadow-subtle)",
      }}
    >
      <span className="text-[13px] font-medium leading-none" style={{ color: "var(--muted)" }}>
        {label}
      </span>
      <span
        className="text-[20px] font-semibold mt-2 tracking-tight leading-none"
        style={{ color: muted ? "var(--placeholder)" : "var(--ink)" }}
      >
        {value}
      </span>
    </div>
  );
};

interface RowProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
  icon?: IconName;
  iconBg?: boolean;
  avatar?: string;
  onClick?: () => void;
  className?: string;
  danger?: boolean;
}

export const Row: React.FC<RowProps> = ({
  title,
  subtitle,
  right,
  icon,
  iconBg = true,
  avatar,
  onClick,
  className = "",
  danger = false,
}) => {
  const isClickable = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      className={`min-h-[64px] py-3 px-4 rounded-[16px] flex items-center justify-between transition-all duration-150 select-none ${
        isClickable ? "cursor-pointer active:scale-[0.99]" : ""
      } ${className}`}
      style={{
        backgroundColor: "var(--surface)",
        boxShadow: "var(--shadow-subtle)",
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        {avatar && (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-[15px] shrink-0"
            style={{
              backgroundColor: "var(--accent-tint)",
              color: "var(--accent)",
            }}
          >
            {avatar}
          </div>
        )}
        {icon && (
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              iconBg ? "" : "bg-transparent"
            }`}
            style={{
              backgroundColor: iconBg ? "var(--accent-tint)" : "transparent",
              color: danger ? "var(--alert)" : "var(--accent)",
            }}
          >
            <Icon name={icon} size={20} />
          </div>
        )}
        <div className="flex flex-col min-w-0">
          <span
            className="text-[15px] font-medium leading-tight truncate"
            style={{ color: danger ? "var(--alert)" : "var(--ink)" }}
          >
            {title}
          </span>
          {subtitle && (
            <span
              className="text-[13px] font-normal leading-tight mt-0.5 truncate"
              style={{ color: "var(--muted)" }}
            >
              {subtitle}
            </span>
          )}
        </div>
      </div>
      {right && <div className="shrink-0 ml-3 flex items-center">{right}</div>}
    </div>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "surface" | "tint" | "alert-tint";
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  onClick,
  variant = "surface",
}) => {
  const isClickable = Boolean(onClick);

  let bg = "var(--surface)";
  let shadow = "var(--shadow-subtle)";

  if (variant === "tint") {
    bg = "var(--accent-tint)";
    shadow = "none";
  } else if (variant === "alert-tint") {
    bg = "var(--alert-tint)";
    shadow = "none";
  }

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-[16px] transition-all duration-150 ${
        isClickable ? "cursor-pointer active:scale-[0.99]" : ""
      } ${className}`}
      style={{
        backgroundColor: bg,
        boxShadow: shadow,
      }}
    >
      {children}
    </div>
  );
};
