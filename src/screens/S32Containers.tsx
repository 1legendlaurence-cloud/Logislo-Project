import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Icon } from "../components/Icon";
import { StatusChip } from "../components/Chip";
import { useDemo } from "../context/Demo";

const FILTER_CHIPS = ["All", "Open", "In transit", "Arrived"];

export const S32Containers: React.FC = () => {
  const { back, go, containers, setSelectedContainerId } = useDemo();
  const [filter, setFilter] = useState("All");

  const filteredContainers = containers.filter(
    (c) => filter === "All" || c.status.toLowerCase() === filter.toLowerCase()
  );

  return (
    <ScreenLayout
      showBack
      onBack={back}
      title="Containers"
      hasNav={true}
    >
      <div className="flex flex-col gap-3.5 pt-1 pb-4 relative min-h-full">
        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar select-none">
          {FILTER_CHIPS.map((f) => {
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

        {/* Container Cards */}
        <div className="flex flex-col gap-2.5">
          {filteredContainers.map((cnt) => (
            <div
              key={cnt.id}
              onClick={() => {
                setSelectedContainerId(cnt.id);
                go("34");
              }}
              className="p-4 rounded-[16px] flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all select-none"
              style={{
                backgroundColor: "var(--surface)",
                boxShadow: "var(--shadow-subtle)",
              }}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-[16px] font-bold text-[var(--ink)]">
                    {cnt.id}
                  </span>
                  <StatusChip status={cnt.status} />
                </div>
                <span className="text-[13px] text-[var(--muted)]">
                  {cnt.size} · {cnt.boxes} boxes
                </span>
              </div>

              <Icon name="chevron-right" size={18} color="var(--muted)" />
            </div>
          ))}
        </div>

        {/* Floating Round New Button */}
        <button
          type="button"
          onClick={() => go("33")}
          className="fixed bottom-[80px] right-6 w-14 h-14 rounded-full flex flex-col items-center justify-center cursor-pointer shadow-[var(--shadow-dialog)] active:scale-95 transition-transform z-30"
          style={{
            backgroundColor: "var(--accent)",
            color: "#FFFFFF",
          }}
          aria-label="New container"
        >
          <Icon name="plus" size={22} color="#FFFFFF" />
        </button>
      </div>
    </ScreenLayout>
  );
};
