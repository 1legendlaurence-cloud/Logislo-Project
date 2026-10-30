import React from "react";
import { Icon } from "./Icon";

interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  variant?: "filter" | "badge";
}

export const Chip: React.FC<ChipProps> = ({
  label,
  active = false,
  onClick,
  className = "",
  variant = "filter",
}) => {
  const isClickable = Boolean(onClick);

  return (
    <button
      type="button"
      disabled={!isClickable}
      onClick={onClick}
      className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-[12px] font-medium transition-all duration-150 select-none whitespace-nowrap ${
        isClickable ? "cursor-pointer active:scale-95" : "cursor-default"
      } ${className}`}
      style={{
        backgroundColor: active
          ? "var(--accent)"
          : variant === "badge"
          ? "var(--accent-tint)"
          : "var(--field)",
        color: active
          ? "#FFFFFF"
          : variant === "badge"
          ? "var(--accent)"
          : "var(--muted)",
      }}
    >
      {label}
    </button>
  );
};

interface StatusChipProps {
  status: string;
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, className = "" }) => {
  let bg = "var(--field)";
  let color = "var(--muted)";

  if (["Deposit paid", "Received", "In transit", "Arrived", "Ready", "Active", "Open"].includes(status)) {
    bg = "var(--accent-tint)";
    color = "var(--accent)";
  } else if (["Unmatched", "Not found"].includes(status)) {
    bg = "var(--alert-tint)";
    color = "var(--alert)";
  } else if (status === "Collected") {
    bg = "var(--field)";
    color = "var(--ink)";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium leading-none select-none whitespace-nowrap ${className}`}
      style={{
        backgroundColor: bg,
        color: color,
      }}
    >
      {status}
    </span>
  );
};

export const LockBadge: React.FC<{ label?: string; className?: string }> = ({
  label = "Pro",
  className = "",
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium select-none ${className}`}
      style={{
        backgroundColor: "var(--accent-tint)",
        color: "var(--accent)",
      }}
    >
      <Icon name="lock" size={11} color="var(--accent)" />
      <span>{label}</span>
    </span>
  );
};
