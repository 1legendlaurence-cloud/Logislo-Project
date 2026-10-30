import React from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { StatusChip, LockBadge } from "../components/Chip";
import { PhotoTile } from "../components/PhotoTile";
import { useDemo } from "../context/Demo";

export const S37ScanCheck: React.FC = () => {
  const { back, go, plan } = useDemo();
  const isBasic = plan === "Basic";

  return (
    <ScreenLayout
      showBack
      onBack={back}
      title="Scan-check"
      hasNav={false}
      footer={
        <Button variant="primary" className="w-full" onClick={() => go("32")}>
          Confirm
        </Button>
      }
    >
      <div className="flex flex-col gap-4 pt-1 pb-4 select-none">
        {/* Container Header Card */}
        <div
          className="p-4 rounded-[18px] flex items-center justify-between"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "var(--accent-tint)",
                color: "var(--accent)",
              }}
            >
              <Icon name="box" size={18} color="var(--accent)" />
            </div>
            <span className="text-[18px] font-bold text-[var(--ink)]">
              C-001
            </span>
          </div>

          <StatusChip status="Arrived" />
        </div>

        {/* 3 Metric Tiles: Expected 40, Scanned 38, Missing 2 (red) */}
        <div className="grid grid-cols-3 gap-2.5">
          <div
            className="p-3.5 rounded-[16px] flex flex-col items-center text-center gap-1.5"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "var(--accent-tint)",
                color: "var(--accent)",
              }}
            >
              <Icon name="box" size={16} color="var(--accent)" />
            </div>
            <span className="text-[12px] font-medium text-[var(--muted)]">
              Expected
            </span>
            <span className="text-[20px] font-bold text-[var(--ink)] leading-none">
              40
            </span>
          </div>

          <div
            className="p-3.5 rounded-[16px] flex flex-col items-center text-center gap-1.5"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "var(--accent-tint)",
                color: "var(--accent)",
              }}
            >
              <Icon name="check" size={16} color="var(--accent)" />
            </div>
            <span className="text-[12px] font-medium text-[var(--muted)]">
              Scanned
            </span>
            <span className="text-[20px] font-bold text-[var(--ink)] leading-none">
              38
            </span>
          </div>

          <div
            onClick={() => go("38")}
            className="p-3.5 rounded-[16px] flex flex-col items-center text-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
            style={{
              backgroundColor: "var(--alert-tint)",
              color: "var(--alert)",
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[14px]"
              style={{
                backgroundColor: "var(--alert)",
                color: "#FFFFFF",
              }}
            >
              !
            </div>
            <span className="text-[12px] font-semibold">Missing</span>
            <span className="text-[20px] font-bold leading-none">2</span>
          </div>
        </div>

        {/* Missing Items Navigation Row */}
        <div
          onClick={() => go("38")}
          className="p-4 rounded-[18px] flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{
                backgroundColor: "var(--accent-tint)",
                color: "var(--accent)",
              }}
            >
              <Icon name="file-text" size={18} color="var(--accent)" />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-[var(--ink)]">
                Missing items
              </span>
              <span className="text-[12px] text-[var(--muted)]">
                View items not found during scan
              </span>
            </div>
          </div>

          <Icon name="chevron-right" size={18} color="var(--muted)" />
        </div>

        {/* Photo Proof Section */}
        <div className="flex flex-col gap-2.5">
          <PhotoTile label="Container arrival photo" height={120} />

          <Button variant="soft" icon="camera" className="w-full">
            <span>Add photo</span>
            {isBasic && <LockBadge label="Pro" className="ml-1" />}
          </Button>
        </div>
      </div>
    </ScreenLayout>
  );
};
