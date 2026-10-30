import React from "react";

interface Option {
  value: string;
  label: string;
  badge?: string;
  locked?: boolean;
}

interface SegmentedProps {
  options: (Option | string)[];
  value: string;
  onChange: (val: string) => void;
  className?: string;
  size?: "default" | "sm";
}

export const Segmented: React.FC<SegmentedProps> = ({
  options,
  value,
  onChange,
  className = "",
  size = "default",
}) => {
  return (
    <div
      className={`flex items-center p-1 rounded-[14px] w-full select-none ${className}`}
      style={{
        backgroundColor: "var(--field)",
        height: size === "default" ? "52px" : "40px",
      }}
    >
      {options.map((opt) => {
        const optVal = typeof opt === "string" ? opt : opt.value;
        const optLabel = typeof opt === "string" ? opt : opt.label;
        const isSelected = value === optVal;

        return (
          <button
            key={optVal}
            type="button"
            onClick={() => onChange(optVal)}
            className={`flex-1 h-full rounded-[10px] text-[14px] font-medium transition-all duration-150 flex items-center justify-center cursor-pointer ${
              isSelected ? "shadow-[var(--shadow-subtle)]" : ""
            }`}
            style={{
              backgroundColor: isSelected ? "var(--surface)" : "transparent",
              color: isSelected ? "var(--ink)" : "var(--muted)",
            }}
          >
            <span>{optLabel}</span>
          </button>
        );
      })}
    </div>
  );
};
