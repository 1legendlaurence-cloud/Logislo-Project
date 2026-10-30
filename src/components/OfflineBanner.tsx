import React from "react";
import { Icon } from "./Icon";
import { useDemo } from "../context/Demo";

export const OfflineBanner: React.FC = () => {
  const { offlineBanner } = useDemo();

  if (!offlineBanner) return null;

  return (
    <div
      className="h-[32px] px-4 flex items-center justify-center gap-1.5 text-[13px] font-medium shrink-0 select-none z-20"
      style={{
        backgroundColor: "var(--alert-tint)",
        color: "var(--alert)",
      }}
    >
      <Icon name="wifi-off" size={14} color="var(--alert)" />
      <span>No connection</span>
    </div>
  );
};
