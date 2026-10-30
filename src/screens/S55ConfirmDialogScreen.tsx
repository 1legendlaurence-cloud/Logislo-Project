import React from "react";
import { S34ContainerDetail } from "./S34ContainerDetail";
import { Button } from "../components/Button";
import { useDemo } from "../context/Demo";

export const S55ConfirmDialogScreen: React.FC = () => {
  const { go, back, variant } = useDemo();

  const isRelease = variant === "release";
  const isDeactivate = variant === "deactivate";
  const isLogout = variant === "logout";

  const title = isRelease
    ? "Release SHP-1005?"
    : isDeactivate
    ? "Deactivate Paul?"
    : isLogout
    ? "Log out?"
    : "Ship C-001?";

  const line1 = isRelease
    ? "Collector: Samuel Dupont"
    : isDeactivate || isLogout
    ? undefined
    : "40 boxes";

  const alertLine =
    !isRelease && !isDeactivate && !isLogout ? "1 without deposit" : undefined;

  const confirmLabel = isRelease
    ? "Release"
    : isDeactivate
    ? "Deactivate"
    : isLogout
    ? "Log out"
    : "Ship";

  const handleConfirm = () => {
    if (isRelease) go("23");
    else if (isDeactivate) go("11");
    else if (isLogout) go("02");
    else go("32");
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Underlying Screen 34 Dimmed */}
      <div className="h-full w-full pointer-events-none">
        <S34ContainerDetail />
      </div>

      {/* Centered Dialog Overlay */}
      <div
        onClick={back}
        className="fixed inset-0 z-50 flex items-center justify-center p-6 select-none"
        style={{ backgroundColor: "rgba(11, 13, 23, 0.45)" }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[340px] p-6 rounded-[24px] flex flex-col items-center text-center gap-2"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-dialog)",
          }}
        >
          <h3 className="text-[20px] font-extrabold text-[var(--ink)]">
            {title}
          </h3>

          {line1 && (
            <p className="text-[14px] text-[var(--muted)]">{line1}</p>
          )}

          {alertLine && (
            <p className="text-[13px] font-medium text-[var(--alert)]">
              {alertLine}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3 w-full pt-4">
            <Button variant="soft" onClick={back}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirm}>
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
