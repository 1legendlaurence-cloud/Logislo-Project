import React from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { StatusChip } from "../components/Chip";
import { useDemo } from "../context/Demo";

export const S38MissingItems: React.FC = () => {
  const { back, go, shipments, setSelectedShipmentId } = useDemo();

  const missingShipments = shipments.filter((s) => s.status === "Expected");

  return (
    <ScreenLayout
      showBack
      onBack={back}
      title="Missing items"
      hasNav={false}
      footer={
        <Button variant="primary" className="w-full" onClick={back}>
          Done
        </Button>
      }
    >
      <div className="flex flex-col gap-3.5 pt-1 pb-4 select-none">
        {/* Status Chip Header Banner */}
        <div className="flex items-center">
          <StatusChip status="Not found" />
        </div>

        {/* Missing Shipment Rows */}
        {missingShipments.length === 0 ? (
          <div
            className="p-6 rounded-[20px] flex flex-col items-center text-center gap-2"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "var(--accent-tint)",
                color: "var(--accent)",
              }}
            >
              <Icon name="check" size={20} color="var(--accent)" />
            </div>
            <span className="text-[14px] font-bold text-[var(--ink)]">
              No missing items
            </span>
            <span className="text-[12px] text-[var(--muted)]">
              All expected shipments have been accounted for.
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {missingShipments.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedShipmentId(item.id);
                  go("26");
                }}
                className="h-[68px] px-4 rounded-[16px] flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
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
                    <Icon name="box" size={18} color="var(--accent)" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-bold text-[var(--ink)]">
                      {item.id}
                    </span>
                    <span className="text-[13px] text-[var(--muted)]">
                      {item.clientName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-semibold text-[var(--ink)]">
                    {item.boxes} box
                  </span>
                  <Icon name="chevron-right" size={16} color="var(--muted)" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ScreenLayout>
  );
};
