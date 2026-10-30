import React from "react";
import { Button } from "./Button";
import { useDemo } from "../context/Demo";

interface ConfirmDialogProps {
  title?: string;
  line1?: string;
  line2?: string;
  alertLine?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  line1,
  line2,
  alertLine,
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
}) => {
  const { confirmDialog, hideConfirm } = useDemo();

  const isOpen = confirmDialog.isOpen || Boolean(title);
  if (!isOpen) return null;

  const currentTitle = title || confirmDialog.title || "Confirm?";
  const currentLine1 = line1 || confirmDialog.line1;
  const currentLine2 = line2 || confirmDialog.line2;
  const currentCancel = cancelLabel || confirmDialog.cancelLabel || "Cancel";
  const currentConfirm = confirmLabel || confirmDialog.confirmLabel || "Confirm";

  const handleCancel = () => {
    if (onCancel) onCancel();
    hideConfirm();
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    if (confirmDialog.onConfirm) confirmDialog.onConfirm();
    hideConfirm();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ backgroundColor: "rgba(14, 17, 22, 0.40)" }}
      onClick={handleCancel}
    >
      <div
        className="w-full max-w-[340px] rounded-[24px] p-6 flex flex-col items-center text-center select-none"
        style={{
          backgroundColor: "var(--surface)",
          boxShadow: "var(--shadow-dialog)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[19px] font-semibold text-[var(--ink)] leading-snug">
          {currentTitle}
        </h3>
        {currentLine1 && (
          <p className="text-[14px] text-[var(--muted)] mt-1.5 leading-tight">
            {currentLine1}
          </p>
        )}
        {currentLine2 && (
          <p className="text-[14px] text-[var(--muted)] mt-1 leading-tight">
            {currentLine2}
          </p>
        )}
        {alertLine && (
          <p className="text-[13px] text-[var(--alert)] font-medium mt-1.5 leading-tight">
            {alertLine}
          </p>
        )}

        <div className="flex items-center gap-3 w-full mt-6">
          <Button
            variant="soft"
            className="flex-1"
            onClick={handleCancel}
          >
            {currentCancel}
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleConfirm}
          >
            {currentConfirm}
          </Button>
        </div>
      </div>
    </div>
  );
};
