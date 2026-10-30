import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { StatusChip } from "../components/Chip";
import { PhotoTile } from "../components/PhotoTile";
import { useDemo } from "../context/Demo";

export const S31UnmatchedItem: React.FC = () => {
  const {
    back,
    go,
    unmatchedItems,
    selectedUnmatchedId,
    shipments,
    matchUnmatchedToShipment,
  } = useDemo();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(shipments[0]?.id || "SHP-1005");

  const item =
    unmatchedItems.find((u) => u.id === selectedUnmatchedId) ||
    unmatchedItems[0] || {
      id: "U-001",
      boxes: 5,
      cbm: 12,
      weightKg: 250,
      date: "Oct 18",
    };

  const candidates = shipments.slice(0, 3).filter(
    (s) =>
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.clientName.toLowerCase().includes(search.toLowerCase()) ||
      s.clientCode.toLowerCase().includes(search.toLowerCase())
  );

  const handleMatch = async () => {
    await matchUnmatchedToShipment(item.id, selectedId);
    go("30");
  };

  return (
    <ScreenLayout
      showBack
      onBack={back}
      hasNav={false}
      headerChildren={
        <div className="flex items-center justify-between w-full">
          <span className="text-[20px] font-extrabold tracking-tight text-[var(--ink)]">
            Unmatched item
          </span>
          <StatusChip status="Unmatched" />
        </div>
      }
      footer={
        <Button variant="primary" className="w-full" onClick={handleMatch}>
          Match
        </Button>
      }
    >
      <div className="flex flex-col gap-4 pt-1 pb-4">
        {/* Top Item Summary with Photo */}
        <div className="flex items-center gap-3.5 select-none">
          <div className="w-[84px] shrink-0">
            <PhotoTile label={item.id} hasPhoto height={84} />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[19px] font-bold text-[var(--ink)]">
              {item.id}
            </span>
            <span className="text-[13px] text-[var(--muted)]">
              {item.boxes} boxes · {item.cbm ?? 12} CBM
            </span>
            <span className="text-[12px] text-[var(--placeholder)]">
              {item.date}
            </span>
          </div>
        </div>

        {/* Boxes & Weight Tiles */}
        <div className="grid grid-cols-2 gap-3 select-none">
          <div
            className="p-3.5 rounded-[16px] flex flex-col justify-between"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <span className="text-[12px] font-medium text-[var(--muted)]">
              Boxes
            </span>
            <span className="text-[18px] font-bold text-[var(--ink)] mt-1">
              {item.boxes}
            </span>
          </div>

          <div
            className="p-3.5 rounded-[16px] flex flex-col justify-between"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <span className="text-[12px] font-medium text-[var(--muted)]">
              Weight
            </span>
            <span className="text-[18px] font-bold text-[var(--ink)] mt-1">
              {item.weightKg ?? 250} kg
            </span>
          </div>
        </div>

        {/* Match Shipment Section */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[16px] font-bold text-[var(--ink)] tracking-tight">
            Match shipment
          </span>

          {/* Search Input */}
          <div className="relative flex items-center w-full">
            <div className="absolute left-4 pointer-events-none text-[var(--muted)]">
              <Icon name="search" size={18} />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="w-full h-[46px] pl-11 pr-4 rounded-[14px] text-[14px] outline-none"
              style={{
                backgroundColor: "var(--field)",
                color: "var(--ink)",
                border: "none",
              }}
            />
          </div>

          {/* 3 Candidate Rows */}
          <div className="flex flex-col gap-2">
            {candidates.map((shp) => {
              const isSelected = selectedId === shp.id;
              return (
                <div
                  key={shp.id}
                  onClick={() => setSelectedId(shp.id)}
                  className={`p-3.5 rounded-[16px] flex items-center justify-between cursor-pointer transition-all select-none ${
                    isSelected ? "ring-2 ring-[var(--accent)]" : ""
                  }`}
                  style={{
                    backgroundColor: "var(--surface)",
                    boxShadow: "var(--shadow-subtle)",
                  }}
                >
                  <div className="flex flex-col">
                    <span className="text-[15px] font-bold text-[var(--ink)]">
                      {shp.id}
                    </span>
                    <span className="text-[13px] text-[var(--muted)] mt-0.5">
                      {shp.clientName} · {shp.clientCode}
                    </span>
                    <span className="text-[12px] text-[var(--placeholder)] mt-0.5">
                      Guangzhou → Douala
                    </span>
                  </div>

                  <Icon
                    name={isSelected ? "check" : "chevron-right"}
                    size={18}
                    color={isSelected ? "var(--accent)" : "var(--muted)"}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ScreenLayout>
  );
};
