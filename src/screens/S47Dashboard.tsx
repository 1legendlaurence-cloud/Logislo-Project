import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Icon } from "../components/Icon";
import { LockBadge } from "../components/Chip";
import { useDemo } from "../context/Demo";
import { exportAgencyExcel, ExportSheetType } from "../utils/excelExport";

export const S47Dashboard: React.FC = () => {
  const {
    back,
    go,
    role,
    plan,
    userProfile,
    shipments,
    payments,
    containers,
    clients,
    unmatchedItems,
  } = useDemo();
  const isBasic = plan === "Basic";
  const [exportOpen, setExportOpen] = useState(false);
  const [exportToast, setExportToast] = useState<string | null>(null);

  const handleExport = (sheet: ExportSheetType) => {
    const filename = exportAgencyExcel(
      {
        agencyName: userProfile.agencyName || "Logislo Agency",
        currency: userProfile.currency || "FCFA",
        shipments,
        containers,
        payments,
        clients,
      },
      sheet
    );
    setExportOpen(false);
    setExportToast(`Exported ${filename}`);
    setTimeout(() => setExportToast(null), 3000);
  };

  const arrivedCount = shipments.filter(
    (s) =>
      s.status === "Arrived" ||
      s.status === "Ready" ||
      s.status === "Collected"
  ).length;
  const inTransitCount = shipments.filter(
    (s) => s.status === "In transit" || s.status === "Received"
  ).length;
  const expectedCount = shipments.filter((s) => s.status === "Expected").length;
  const missingCount = unmatchedItems.length;

  const maxBar = Math.max(
    1,
    arrivedCount,
    inTransitCount,
    expectedCount,
    missingCount
  );

  const statusBars = [
    {
      label: "Arrived",
      count: arrivedCount,
      heightPct: Math.max(12, Math.round((arrivedCount / maxBar) * 100)),
    },
    {
      label: "In transit",
      count: inTransitCount,
      heightPct: Math.max(12, Math.round((inTransitCount / maxBar) * 100)),
    },
    {
      label: "Expected",
      count: expectedCount,
      heightPct: Math.max(12, Math.round((expectedCount / maxBar) * 100)),
    },
    {
      label: "Unmatched",
      count: missingCount,
      heightPct: Math.max(12, Math.round((missingCount / maxBar) * 100)),
      isAlert: true,
    },
  ];

  const totalCollected = payments
    .filter((p) => p.amount > 0)
    .reduce((sum, p) => sum + p.amount, 0);
  const totalOwed = shipments.reduce(
    (sum, s) => sum + (s.balance > 0 ? s.balance : 0),
    0
  );
  const inStorageCount = shipments.filter(
    (s) => s.status === "Arrived" || s.status === "Ready"
  ).length;
  const latestContainer = containers[0];
  const latestProfit = latestContainer?.profit ?? 0;

  return (
    <ScreenLayout
      showBack
      onBack={back}
      hasNav={true}
      headerChildren={
        <div className="flex items-center justify-between w-full">
          <span className="text-[22px] font-extrabold tracking-tight text-[var(--ink)]">
            Dashboard
          </span>
          <button
            type="button"
            onClick={() => setExportOpen(true)}
            className="h-9 px-3 rounded-full flex items-center gap-1.5 text-[12px] font-bold cursor-pointer active:scale-95 transition-transform"
            style={{
              backgroundColor: "var(--accent-tint)",
              color: "var(--accent)",
            }}
          >
            <Icon name="download" size={14} color="var(--accent)" />
            <span>Export Excel</span>
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 pt-1 pb-4 select-none">
        {exportToast && (
          <div
            className="px-4 py-2 rounded-full flex items-center justify-center gap-2 text-[12px] font-semibold"
            style={{
              backgroundColor: "var(--accent)",
              color: "#FFFFFF",
            }}
          >
            <Icon name="check" size={14} color="#FFFFFF" />
            <span>{exportToast}</span>
          </div>
        )}

        {/* Logislo Copilot Card (Owner Only) */}
        {role === "Owner" && (
          <div
            onClick={() => go("60")}
            className="p-4 rounded-[18px] flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className="w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, #0B5FFF 0%, #3B82F6 100%)",
                  color: "#FFFFFF",
                }}
              >
                <Icon name="sparkles" size={18} color="#FFFFFF" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-bold text-[var(--ink)] leading-tight truncate">
                    Logislo Copilot
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: "var(--accent-tint)",
                      color: "var(--accent)",
                    }}
                  >
                    Pro
                  </span>
                </div>
                <span className="text-[12px] text-[var(--muted)] leading-tight mt-0.5 truncate">
                  Sales, container insights & voice queries (EN / FR / 中文)
                </span>
              </div>
            </div>
            <Icon name="chevron-right" size={18} color="var(--muted)" />
          </div>
        )}

        {/* Shipments by Status Bar Card */}
        <div
          className="p-5 rounded-[18px] flex flex-col gap-4"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <span className="text-[16px] font-bold text-[var(--ink)] tracking-tight">
            Shipments by status
          </span>

          <div className="grid grid-cols-4 gap-3 items-end h-[120px] pt-4">
            {statusBars.map((bar) => (
              <div
                key={bar.label}
                className="flex flex-col items-center justify-end h-full gap-1.5"
              >
                <div className="w-full flex items-end justify-center flex-1">
                  <div
                    className="w-11 rounded-t-[8px] transition-all"
                    style={{
                      height: `${bar.count === 0 ? 8 : bar.heightPct}%`,
                      backgroundColor: bar.isAlert
                        ? "var(--alert)"
                        : "var(--accent)",
                      opacity: bar.count === 0 ? 0.25 : 1,
                    }}
                  />
                </div>
                <span className="text-[11px] font-medium text-[var(--muted)]">
                  {bar.label}
                </span>
                <span
                  className="text-[15px] font-bold leading-none"
                  style={{
                    color: bar.isAlert ? "var(--alert)" : "var(--accent)",
                  }}
                >
                  {bar.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2x2 Financial & Storage Tiles */}
        <div className="grid grid-cols-2 gap-3">
          {/* Collected Tile */}
          <div
            onClick={() => go("39")}
            className="p-4 rounded-[18px] flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-all min-h-[126px]"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div
              className="w-9 h-9 rounded-[12px] flex items-center justify-center"
              style={{
                backgroundColor: "var(--accent-tint)",
                color: "var(--accent)",
              }}
            >
              <Icon name="check" size={18} color="var(--accent)" />
            </div>
            <div className="flex flex-col mt-3">
              <span className="text-[13px] font-medium text-[var(--muted)]">
                Collected
              </span>
              <span className="text-[18px] font-extrabold text-[var(--ink)] leading-tight mt-1">
                {totalCollected.toLocaleString()}
              </span>
              <span className="text-[11px] font-semibold text-[var(--muted)]">
                FCFA
              </span>
            </div>
          </div>

          {/* Owed Tile */}
          <div
            onClick={() => go("39")}
            className="p-4 rounded-[18px] flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-all min-h-[126px]"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div
              className="w-9 h-9 rounded-[12px] flex items-center justify-center font-bold text-[15px]"
              style={{
                backgroundColor: "var(--alert-tint)",
                color: "var(--alert)",
              }}
            >
              !
            </div>
            <div className="flex flex-col mt-3">
              <span className="text-[13px] font-medium text-[var(--alert)]">
                Owed
              </span>
              <span className="text-[18px] font-extrabold text-[var(--ink)] leading-tight mt-1">
                {totalOwed.toLocaleString()}
              </span>
              <span className="text-[11px] font-semibold text-[var(--muted)]">
                FCFA
              </span>
            </div>
          </div>

          {/* In storage Tile */}
          <div
            onClick={() => go("45")}
            className="p-4 rounded-[18px] flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-all min-h-[126px]"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div
              className="w-9 h-9 rounded-[12px] flex items-center justify-center"
              style={{
                backgroundColor: "var(--accent-tint)",
                color: "var(--accent)",
              }}
            >
              <Icon name="box" size={18} color="var(--accent)" />
            </div>
            <div className="flex flex-col mt-3">
              <span className="text-[13px] font-medium text-[var(--muted)]">
                In storage
              </span>
              <span className="text-[22px] font-extrabold text-[var(--ink)] leading-none mt-1">
                {inStorageCount}
              </span>
            </div>
          </div>

          {/* Profit per container Tile */}
          <div
            onClick={() => (isBasic ? go("15") : go("32"))}
            className="p-4 rounded-[18px] flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-all min-h-[126px]"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div className="flex items-center justify-between">
              <div
                className="w-9 h-9 rounded-[12px] flex items-center justify-center"
                style={{
                  backgroundColor: "var(--accent-tint)",
                  color: "var(--accent)",
                }}
              >
                <Icon name="layers" size={18} color="var(--accent)" />
              </div>
              {isBasic && <LockBadge label="Pro" />}
            </div>
            <div
              className={`flex flex-col mt-3 ${isBasic ? "opacity-60" : ""}`}
            >
              <span className="text-[12px] font-medium text-[var(--muted)]">
                Profit per container
              </span>
              <span className="text-[13px] font-bold text-[var(--ink)] mt-0.5">
                {latestContainer?.id || "No container"}
              </span>
              <span className="text-[16px] font-extrabold text-[var(--accent)] leading-tight mt-0.5">
                {latestProfit >= 0 ? "+" : ""}
                {latestProfit.toLocaleString()} FCFA
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Excel Export Modal Sheet */}
      {exportOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ backgroundColor: "rgba(11, 13, 23, 0.45)" }}
          onClick={() => setExportOpen(false)}
        >
          <div
            className="w-full max-w-[390px] rounded-t-[24px] p-5 flex flex-col gap-3"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-dialog)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="text-[17px] font-extrabold text-[var(--ink)]">
                Export Excel Report
              </span>
              <button
                type="button"
                onClick={() => setExportOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: "var(--field)" }}
              >
                <Icon name="close" size={16} color="var(--ink)" />
              </button>
            </div>

            <p className="text-[12px] text-[var(--muted)]">
              Download your live agency spreadsheets formatted for Microsoft
              Excel and Google Sheets.
            </p>

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleExport("all")}
                className="p-3.5 rounded-[14px] flex items-center justify-between text-left cursor-pointer active:scale-[0.99] transition-all"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "#FFFFFF",
                }}
              >
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold">
                    Full Agency Workbook (.xls)
                  </span>
                  <span className="text-[11px] opacity-85">
                    5 tabs: Summary, Shipments & Cargo, Containers, Payments,
                    Clients
                  </span>
                </div>
                <Icon name="download" size={18} color="#FFFFFF" />
              </button>

              <button
                type="button"
                onClick={() => handleExport("shipments")}
                className="p-3.5 rounded-[14px] flex items-center justify-between text-left cursor-pointer active:scale-[0.99] transition-all"
                style={{
                  backgroundColor: "var(--field)",
                  color: "var(--ink)",
                }}
              >
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold">
                    Shipments & Products Bought (.csv)
                  </span>
                  <span className="text-[11px] text-[var(--muted)]">
                    Cargo descriptions, boxes, weight, CBM, fees & balances
                  </span>
                </div>
                <Icon name="download" size={16} color="var(--accent)" />
              </button>

              <button
                type="button"
                onClick={() => handleExport("payments")}
                className="p-3.5 rounded-[14px] flex items-center justify-between text-left cursor-pointer active:scale-[0.99] transition-all"
                style={{
                  backgroundColor: "var(--field)",
                  color: "var(--ink)",
                }}
              >
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold">
                    Sales & Payments Ledger (.csv)
                  </span>
                  <span className="text-[11px] text-[var(--muted)]">
                    All receipts, payment methods & amounts collected
                  </span>
                </div>
                <Icon name="download" size={16} color="var(--accent)" />
              </button>

              <button
                type="button"
                onClick={() => handleExport("containers")}
                className="p-3.5 rounded-[14px] flex items-center justify-between text-left cursor-pointer active:scale-[0.99] transition-all"
                style={{
                  backgroundColor: "var(--field)",
                  color: "var(--ink)",
                }}
              >
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold">
                    Containers & Profitability (.csv)
                  </span>
                  <span className="text-[11px] text-[var(--muted)]">
                    Container capacity, shipping costs & net profit
                  </span>
                </div>
                <Icon name="download" size={16} color="var(--accent)" />
              </button>
            </div>
          </div>
        </div>
      )}
    </ScreenLayout>
  );
};
