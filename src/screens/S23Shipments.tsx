import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Icon } from "../components/Icon";
import { StatusChip } from "../components/Chip";
import { useDemo } from "../context/Demo";
import { exportSingleSheetCsv } from "../utils/excelExport";

const FILTER_OPTIONS = [
  "All",
  "Expected",
  "In transit",
  "Arrived",
  "Ready",
  "Collected",
  "Unmatched",
];

export const S23Shipments: React.FC = () => {
  const {
    go,
    shipments,
    containers,
    payments,
    clients,
    userProfile,
    setSelectedShipmentId,
  } = useDemo();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [exportedMsg, setExportedMsg] = useState<string | null>(null);

  const filteredShipments = shipments.filter((shp) => {
    const matchesFilter =
      filter === "All" || shp.status.toLowerCase() === filter.toLowerCase();

    const matchesSearch =
      shp.id.toLowerCase().includes(search.toLowerCase()) ||
      shp.clientName.toLowerCase().includes(search.toLowerCase()) ||
      shp.route.toLowerCase().includes(search.toLowerCase()) ||
      (shp.description || "").toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleExportShipments = () => {
    const filename = exportSingleSheetCsv(
      {
        agencyName: userProfile.agencyName || "Logislo",
        currency: userProfile.currency || "FCFA",
        shipments: filteredShipments,
        containers,
        payments,
        clients,
      },
      "shipments"
    );
    setExportedMsg(`Exported ${filename}`);
    setTimeout(() => setExportedMsg(null), 3000);
  };

  return (
    <ScreenLayout
      hasNav={true}
      headerChildren={
        <div className="flex items-center justify-between w-full">
          <span className="text-[22px] font-extrabold tracking-tight text-[var(--ink)]">
            Shipments
          </span>
          <button
            type="button"
            onClick={handleExportShipments}
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
      <div className="flex flex-col gap-3.5 pt-1 pb-4 relative min-h-full">
        {exportedMsg && (
          <div
            className="px-4 py-2 rounded-full flex items-center justify-center gap-2 text-[12px] font-semibold"
            style={{
              backgroundColor: "var(--accent)",
              color: "#FFFFFF",
            }}
          >
            <Icon name="check" size={14} color="#FFFFFF" />
            <span>{exportedMsg}</span>
          </div>
        )}

        {/* Search input */}
        <div className="relative flex items-center w-full">
          <div className="absolute left-4 pointer-events-none text-[var(--muted)]">
            <Icon name="search" size={18} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ID, client, route, or product..."
            className="w-full h-[48px] pl-11 pr-4 rounded-[14px] text-[15px] outline-none"
            style={{
              backgroundColor: "var(--field)",
              color: "var(--ink)",
              border: "none",
            }}
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar select-none">
          {FILTER_OPTIONS.map((f) => {
            const isActive = filter === f;

            return (
              <button
                key={f}
                type="button"
                onClick={() => {
                  if (f === "Unmatched") {
                    go("30");
                  } else {
                    setFilter(f);
                  }
                }}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive ? "text-white" : "text-[var(--ink)]"
                }`}
                style={{
                  backgroundColor: isActive ? "var(--accent)" : "var(--field)",
                }}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* Shipment List */}
        <div className="flex flex-col gap-2.5">
          {filteredShipments.map((shp) => (
            <div
              key={shp.id}
              onClick={() => {
                setSelectedShipmentId(shp.id);
                go("26");
              }}
              className="p-4 rounded-[16px] flex flex-col gap-2 cursor-pointer active:scale-[0.99] transition-all select-none"
              style={{
                backgroundColor: "var(--surface)",
                boxShadow: "var(--shadow-subtle)",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[16px] font-bold text-[var(--ink)]">
                  {shp.id}
                </span>
                <StatusChip status={shp.status} />
              </div>

              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-[var(--ink)]">
                  {shp.clientName}
                </span>
                <span className="text-[12px] text-[var(--muted)] mt-0.5">
                  {shp.route} · {shp.boxes} boxes · {shp.cbm ?? 1} CBM
                </span>
                <span className="text-[11px] text-[var(--placeholder)] mt-1">
                  Oct 12, 2026
                </span>
              </div>
            </div>
          ))}

          {filteredShipments.length === 0 && (
            <div className="text-center py-10 text-[14px] text-[var(--muted)]">
              No shipments found
            </div>
          )}
        </div>

        {/* Floating Add Pre-alert Button */}
        <button
          type="button"
          onClick={() => go("24")}
          className="fixed bottom-[80px] right-6 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-[var(--shadow-dialog)] active:scale-95 transition-transform z-30"
          style={{
            backgroundColor: "var(--accent)",
            color: "#FFFFFF",
          }}
          aria-label="New pre-alert"
        >
          <Icon name="plus" size={24} color="#FFFFFF" />
        </button>
      </div>
    </ScreenLayout>
  );
};
