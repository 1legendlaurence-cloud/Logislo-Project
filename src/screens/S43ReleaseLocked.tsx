import React from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Icon } from "../components/Icon";
import { StatusChip } from "../components/Chip";
import { useDemo } from "../context/Demo";

export const S43ReleaseLocked: React.FC = () => {
  const { back, go, role, shipments, selectedShipmentId } = useDemo();
  const isWarehouse = role === "Warehouse worker";

  const shp =
    shipments.find((s) => s.id === selectedShipmentId) || shipments[0];

  return (
    <ScreenLayout
      showBack
      onBack={back}
      title="Release locked"
      hasNav={false}
      footer={
        <button
          type="button"
          onClick={() => go("44")}
          className="w-full h-[52px] rounded-[14px] flex items-center justify-center gap-2 font-semibold text-[15px] opacity-60 cursor-pointer select-none"
          style={{
            backgroundColor: "var(--field)",
            color: "var(--muted)",
          }}
          title="Tap to preview unlocked Release goods (44)"
        >
          <Icon name="lock" size={16} color="var(--muted)" />
          <span>Release</span>
        </button>
      }
    >
      <div className="flex flex-col gap-4 pt-1 pb-4 select-none">
        {/* Shipment Header Card */}
        <div
          className="p-4 rounded-[18px] flex items-center justify-between"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
              style={{
                backgroundColor: "var(--accent-tint)",
                color: "var(--accent)",
              }}
            >
              <Icon name="box" size={20} color="var(--accent)" />
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] font-bold text-[var(--ink)]">
                {shp?.id || "SHP-1005"}
              </span>
              <span className="text-[13px] text-[var(--muted)]">
                {shp?.clientName || "Jean Dupont"}
              </span>
            </div>
          </div>

          <StatusChip status="Ready" />
        </div>

        {/* Red Alert Card */}
        <div
          onClick={() => !isWarehouse && go("40")}
          className={`p-4 rounded-[18px] flex items-center gap-3.5 ${
            !isWarehouse ? "cursor-pointer" : ""
          }`}
          style={{
            backgroundColor: "var(--alert-tint)",
            color: "var(--alert)",
          }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-[16px] shrink-0"
            style={{
              backgroundColor: "var(--alert)",
              color: "#FFFFFF",
            }}
          >
            !
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold">
              {isWarehouse ? "Payment status" : "Balance due"}
            </span>
            <span className="text-[20px] font-extrabold leading-tight mt-0.5">
              {isWarehouse
                ? "Not cleared"
                : `${(shp?.balance || 370000).toLocaleString()} FCFA`}
            </span>
          </div>
        </div>

        {/* Release Checklist */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[16px] font-bold text-[var(--ink)] tracking-tight">
            Release checklist
          </span>

          <div
            className="p-4 rounded-[18px] flex flex-col gap-3.5"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            {/* Row 1: Balance */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[12px]"
                  style={{
                    backgroundColor: "var(--alert-tint)",
                    color: "var(--alert)",
                  }}
                >
                  !
                </div>
                <span className="text-[14px] font-medium text-[var(--ink)]">
                  {isWarehouse ? "Cleared" : "Balance 0 FCFA"}
                </span>
              </div>
              <span
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                style={{
                  backgroundColor: "var(--alert-tint)",
                  color: "var(--alert)",
                }}
              >
                Not met
              </span>
            </div>

            {/* Row 2: Goods photo */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[12px]"
                  style={{
                    backgroundColor: "var(--field)",
                    color: "var(--muted)",
                  }}
                >
                  !
                </div>
                <span className="text-[14px] font-medium text-[var(--ink)]">
                  Goods photo
                </span>
              </div>
              <span
                className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                style={{
                  backgroundColor: "var(--field)",
                  color: "var(--muted)",
                }}
              >
                Pending
              </span>
            </div>

            {/* Row 3: Collector name */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[12px]"
                  style={{
                    backgroundColor: "var(--field)",
                    color: "var(--muted)",
                  }}
                >
                  !
                </div>
                <span className="text-[14px] font-medium text-[var(--ink)]">
                  Collector name
                </span>
              </div>
              <span
                className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                style={{
                  backgroundColor: "var(--field)",
                  color: "var(--muted)",
                }}
              >
                Pending
              </span>
            </div>
          </div>
        </div>
      </div>
    </ScreenLayout>
  );
};
