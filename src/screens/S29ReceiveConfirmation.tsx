import React from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { StatusChip } from "../components/Chip";
import { PhotoTile } from "../components/PhotoTile";
import { useDemo } from "../context/Demo";

export const S29ReceiveConfirmation: React.FC = () => {
  const { back, go, shipments, selectedShipmentId } = useDemo();

  const shp =
    shipments.find((s) => s.id === selectedShipmentId) || shipments[0];

  return (
    <ScreenLayout
      showBack
      onBack={back}
      title="Receive confirmation"
      hasNav={false}
      footer={
        <Button variant="primary" className="w-full" onClick={() => go("23")}>
          Confirm
        </Button>
      }
    >
      <div className="flex flex-col gap-5 pt-1 pb-4">
        {/* Shipment Header Info */}
        <div className="flex flex-col gap-1.5 select-none">
          <div className="flex items-center gap-3">
            <span className="text-[22px] font-extrabold tracking-tight text-[var(--ink)]">
              {shp?.id || "SHP-1005"}
            </span>
            <StatusChip status="Received" />
          </div>

          <span className="text-[14px] text-[var(--muted)]">
            {shp?.clientName || "Jean Dupont"} · {shp?.clientCode || "JEAN-017"}
          </span>

          <div className="flex items-center gap-1.5 text-[14px] text-[var(--muted)]">
            <span>Guangzhou</span>
            <Icon name="arrow-right" size={14} color="var(--muted)" />
            <span>Douala</span>
          </div>
        </div>

        {/* Expected vs Received Tiles */}
        <div className="grid grid-cols-2 gap-3 select-none">
          <div
            className="p-4 rounded-[16px] flex flex-col justify-between"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <span className="text-[13px] font-medium text-[var(--muted)]">
              Expected
            </span>
            <span className="text-[22px] font-bold text-[var(--ink)] leading-none mt-2">
              {shp?.boxes ?? 12}
            </span>
          </div>

          <div
            className="p-4 rounded-[16px] flex flex-col justify-between"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <span className="text-[13px] font-medium text-[var(--muted)]">
              Received
            </span>
            <span className="text-[22px] font-bold text-[var(--ink)] leading-none mt-2">
              {shp?.boxes ?? 12}
            </span>
          </div>
        </div>

        {/* Goods Photo Tile */}
        <div className="flex flex-col gap-2 select-none">
          <span className="text-[14px] font-bold text-[var(--ink)]">
            Goods photo
          </span>
          <PhotoTile label="Goods received photo" hasPhoto height={200} />
        </div>
      </div>
    </ScreenLayout>
  );
};
