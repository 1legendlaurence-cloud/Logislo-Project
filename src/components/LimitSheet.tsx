import React from "react";
import { Icon } from "./Icon";
import { Button } from "./Button";
import { useDemo } from "../context/Demo";

interface LimitSheetProps {
  variant?: "routes" | "staff";
  onClose?: () => void;
}

export const LimitSheet: React.FC<LimitSheetProps> = ({ variant, onClose }) => {
  const { limitSheet, hideLimit, go } = useDemo();

  const currentVariant = variant || limitSheet.variant;
  const isOpen = limitSheet.isOpen || Boolean(variant);

  if (!isOpen || !currentVariant) return null;

  const handleClose = () => {
    if (onClose) onClose();
    hideLimit();
  };

  const handleUpgrade = () => {
    handleClose();
    go("15"); // Plan screen
  };

  const isRoutes = currentVariant === "routes";
  const title = isRoutes ? "Route limit reached" : "Staff limit reached";
  const subtitle = isRoutes ? "1 of 1 route" : "3 of 3 staff";

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ backgroundColor: "rgba(14, 17, 22, 0.40)" }}
      onClick={handleClose}
    >
      <div
        className="w-full max-w-[430px] mx-auto rounded-t-[24px] p-6 pb-8 flex flex-col items-center text-center select-none animate-in slide-in-from-bottom duration-200"
        style={{
          backgroundColor: "var(--surface)",
          boxShadow: "var(--shadow-sheet)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
          style={{
            backgroundColor: "var(--accent-tint)",
            color: "var(--accent)",
          }}
        >
          <Icon name="lock" size={24} color="var(--accent)" />
        </div>

        <h3 className="text-[20px] font-semibold text-[var(--ink)] leading-snug">
          {title}
        </h3>
        <p className="text-[14px] text-[var(--muted)] mt-1 mb-6 leading-tight">
          {subtitle}
        </p>

        <div className="flex flex-col gap-2.5 w-full">
          <Button variant="primary" className="w-full" onClick={handleUpgrade}>
            Upgrade
          </Button>
          <Button variant="soft" className="w-full" onClick={handleClose}>
            Not now
          </Button>
        </div>
      </div>
    </div>
  );
};
