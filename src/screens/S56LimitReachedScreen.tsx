import React from "react";
import { S11Staff } from "./S11Staff";
import { S07Routes } from "./S07Routes";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { useDemo } from "../context/Demo";

export const S56LimitReachedScreen: React.FC = () => {
  const { go, back, variant } = useDemo();
  const isRoutes = variant === "routes";

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Underlying Screen Dimmed */}
      <div className="h-full w-full pointer-events-none">
        {isRoutes ? <S07Routes /> : <S11Staff />}
      </div>

      {/* Bottom Sheet Overlay */}
      <div
        onClick={back}
        className="fixed inset-0 z-50 flex items-end justify-center select-none"
        style={{ backgroundColor: "rgba(11, 13, 23, 0.45)" }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[430px] p-6 rounded-t-[24px] flex flex-col items-center text-center gap-3"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-dialog)",
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-1"
            style={{
              backgroundColor: "var(--accent-tint)",
              color: "var(--accent)",
            }}
          >
            <Icon name="lock" size={26} color="var(--accent)" />
          </div>

          <h3 className="text-[20px] font-extrabold text-[var(--ink)]">
            {isRoutes ? "Route limit reached" : "Staff limit reached"}
          </h3>

          <p className="text-[14px] text-[var(--muted)]">
            {isRoutes ? "1 of 1 route" : "3 of 3 staff"}
          </p>

          <div className="flex flex-col gap-2.5 w-full pt-3">
            <Button
              variant="primary"
              className="w-full"
              onClick={() => go("15")}
            >
              Upgrade
            </Button>
            <Button variant="soft" className="w-full" onClick={back}>
              Not now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
