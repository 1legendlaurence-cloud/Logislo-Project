import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Icon } from "../components/Icon";
import { StatusChip } from "../components/Chip";
import { useDemo } from "../context/Demo";

const PAYMENT_FILTERS = ["All", "Deposit", "Balance", "Storage"];

export const S39Payments: React.FC = () => {
  const {
    back,
    go,
    payments,
    setSelectedPaymentId,
    setSelectedShipmentId,
  } = useDemo();
  const [filter, setFilter] = useState("All");

  const rows = payments.map((p) => {
    let displayType: string = p.type;
    if (p.amount === 0) displayType = "Paid";
    if (p.amount < 0) displayType = "Credit";
    return {
      ...p,
      displayType,
      targetScreen: p.type === "Balance" && (p.remaining || 0) > 0 ? "41" : "42",
    };
  });

  const filtered = rows.filter((r) => {
    if (filter === "All") return true;
    return (
      r.type.toLowerCase() === filter.toLowerCase() ||
      r.displayType.toLowerCase() === filter.toLowerCase()
    );
  });

  return (
    <ScreenLayout
      showBack
      onBack={back}
      title="Payments"
      hasNav={true}
    >
      <div className="flex flex-col gap-3.5 pt-1 pb-4 select-none">
        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {PAYMENT_FILTERS.map((f) => {
            const isActive = filter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
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

        {/* Payment Rows */}
        <div className="flex flex-col gap-2.5">
          {filtered.map((row) => (
            <div
              key={row.id}
              onClick={() => {
                setSelectedPaymentId(row.id);
                setSelectedShipmentId(row.shipmentId);
                go(row.targetScreen);
              }}
              className="p-4 rounded-[16px] flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
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
                  <span className="text-[15px] font-bold text-[var(--ink)]">
                    {row.shipmentId}
                  </span>
                  <span className="text-[13px] text-[var(--muted)]">
                    {row.displayType}
                  </span>
                  <span className="text-[11px] text-[var(--placeholder)] mt-0.5">
                    {row.date}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                <span className="text-[15px] font-bold text-[var(--ink)]">
                  {row.amount.toLocaleString()} FCFA
                </span>
                {row.remaining !== undefined && row.remaining > 0 && (
                  <span className="text-[11px] text-[var(--muted)]">
                    remaining
                  </span>
                )}
                <StatusChip status={row.displayType} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScreenLayout>
  );
};
