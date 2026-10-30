import React from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Icon } from "../components/Icon";
import { StatusChip, LockBadge } from "../components/Chip";
import { useDemo } from "../context/Demo";

export const S18HomeWarehouse: React.FC = () => {
  const {
    go,
    plan,
    setMoreSheetOpen,
    shipments,
    containers,
    unmatchedItems,
    setSelectedShipmentId,
  } = useDemo();
  const [office, setOffice] = React.useState<"Guangzhou" | "Douala">("Guangzhou");
  const isBasic = plan === "Basic";

  const toReceiveCount = shipments.filter((s) => s.status === "Expected").length;
  const receivedCount = shipments.filter((s) => s.status !== "Expected").length;
  const inStorageCount = shipments.filter(
    (s) => s.status === "Arrived" || s.status === "Ready"
  ).length;
  const containerCheckCount = containers.length;

  return (
    <ScreenLayout
      title="Home"
      hasNav={true}
      avatarInitial={office === "Guangzhou" ? "G" : "D"}
      onAvatarClick={() => setMoreSheetOpen(true)}
    >
      <div className="flex flex-col gap-4 pt-1 pb-4">
        {/* Office Segmented Switcher */}
        <div className="flex items-center justify-between">
          <div className="w-full">
            <div className="grid grid-cols-2 p-1 rounded-[14px] bg-[var(--field)]">
              <button
                type="button"
                onClick={() => setOffice("Guangzhou")}
                className={`py-2 text-[13px] font-semibold rounded-[10px] transition-all cursor-pointer ${
                  office === "Guangzhou"
                    ? "bg-[var(--surface)] text-[var(--ink)] shadow-xs"
                    : "text-[var(--muted)]"
                }`}
              >
                Guangzhou
              </button>
              <button
                type="button"
                onClick={() => setOffice("Douala")}
                className={`py-2 text-[13px] font-semibold rounded-[10px] transition-all cursor-pointer ${
                  office === "Douala"
                    ? "bg-[var(--surface)] text-[var(--ink)] shadow-xs"
                    : "text-[var(--muted)]"
                }`}
              >
                Douala
              </button>
            </div>
          </div>
        </div>

        {/* Guangzhou Operations */}
        {office === "Guangzhou" ? (
          <div className="grid grid-cols-3 gap-2.5 select-none">
            <div
              onClick={() => go("28")}
              className="p-3.5 rounded-[18px] flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-all min-h-[106px]"
              style={{
                backgroundColor: "var(--surface)",
                boxShadow: "var(--shadow-subtle)",
              }}
            >
              <div className="text-[var(--accent)] mb-2">
                <Icon name="box" size={20} color="var(--accent)" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-medium text-[var(--muted)]">
                  To receive
                </span>
                <span className="text-[20px] font-bold text-[var(--ink)] leading-none mt-1">
                  {toReceiveCount}
                </span>
              </div>
            </div>

            <div
              onClick={() => go("23")}
              className="p-3.5 rounded-[18px] flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-all min-h-[106px]"
              style={{
                backgroundColor: "var(--surface)",
                boxShadow: "var(--shadow-subtle)",
              }}
            >
              <div className="text-[var(--accent)] mb-2">
                <Icon name="check" size={20} color="var(--accent)" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-medium text-[var(--muted)]">
                  Received
                </span>
                <span className="text-[20px] font-bold text-[var(--ink)] leading-none mt-1">
                  {receivedCount}
                </span>
              </div>
            </div>

            <div
              onClick={() => go("30")}
              className="p-3.5 rounded-[18px] flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-all min-h-[106px]"
              style={{
                backgroundColor: "var(--surface)",
                boxShadow: "var(--shadow-subtle)",
              }}
            >
              <div className="flex items-center justify-between text-[var(--accent)] mb-2">
                <Icon name="scan" size={20} color="var(--accent)" />
                {isBasic && <LockBadge label="Pro" />}
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-medium text-[var(--muted)]">
                  Unmatched
                </span>
                <span className="text-[20px] font-bold text-[var(--ink)] leading-none mt-1">
                  {unmatchedItems.length}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Douala Operations */
          <div className="grid grid-cols-3 gap-2.5 select-none">
            <div
              onClick={() => go("37")}
              className="p-3.5 rounded-[18px] flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-all min-h-[106px]"
              style={{
                backgroundColor: "var(--surface)",
                boxShadow: "var(--shadow-subtle)",
              }}
            >
              <div className="text-[var(--accent)] mb-2">
                <Icon name="scan" size={20} color="var(--accent)" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-medium text-[var(--muted)]">
                  Scan-check
                </span>
                <span className="text-[20px] font-bold text-[var(--ink)] leading-none mt-1">
                  {containerCheckCount} CNT
                </span>
              </div>
            </div>

            <div
              onClick={() => go("45")}
              className="p-3.5 rounded-[18px] flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-all min-h-[106px]"
              style={{
                backgroundColor: "var(--surface)",
                boxShadow: "var(--shadow-subtle)",
              }}
            >
              <div className="text-[var(--accent)] mb-2">
                <Icon name="box" size={20} color="var(--accent)" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-medium text-[var(--muted)]">
                  In storage
                </span>
                <span className="text-[20px] font-bold text-[var(--ink)] leading-none mt-1">
                  {inStorageCount} items
                </span>
              </div>
            </div>

            <div
              onClick={() => go("44")}
              className="p-3.5 rounded-[18px] flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-all min-h-[106px]"
              style={{
                backgroundColor: "var(--surface)",
                boxShadow: "var(--shadow-subtle)",
              }}
            >
              <div className="text-[var(--accent)] mb-2">
                <Icon name="check" size={20} color="var(--accent)" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-medium text-[var(--muted)]">
                  Release
                </span>
                <span className="text-[20px] font-bold text-[var(--ink)] leading-none mt-1">
                  {inStorageCount}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Recent Shipments Section */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[17px] font-bold text-[var(--ink)] tracking-tight">
            Recent
          </span>

          <div className="flex flex-col gap-2">
            {shipments.map((shp) => (
              <div
                key={shp.id}
                onClick={() => {
                  setSelectedShipmentId(shp.id);
                  go("26");
                }}
                className="h-[68px] px-4 rounded-[16px] flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all select-none"
                style={{
                  backgroundColor: "var(--surface)",
                  boxShadow: "var(--shadow-subtle)",
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: "var(--accent-tint)",
                      color: "var(--accent)",
                    }}
                  >
                    <Icon name="box" size={18} color="var(--accent)" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[15px] font-semibold text-[var(--ink)] leading-tight truncate">
                      {shp.id}
                    </span>
                    <span className="text-[13px] text-[var(--muted)] leading-tight mt-0.5 truncate">
                      {shp.clientName}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                  <span className="text-[11px] text-[var(--muted)]">
                    {shp.dateLabel || "Today"}
                  </span>
                  <StatusChip status={shp.status} />
                </div>
              </div>
            ))}

            {shipments.length === 0 && (
              <div
                className="p-6 rounded-[18px] flex flex-col items-center text-center gap-2 select-none"
                style={{
                  backgroundColor: "var(--surface)",
                  boxShadow: "var(--shadow-subtle)",
                }}
              >
                <span className="text-[15px] font-bold text-[var(--ink)]">
                  No warehouse cargo yet
                </span>
                <p className="text-[13px] text-[var(--muted)] max-w-[240px]">
                  Incoming pre-alerts and received boxes will appear here automatically.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ScreenLayout>
  );
};
