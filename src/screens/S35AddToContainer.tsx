import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { useDemo } from "../context/Demo";

export const S35AddToContainer: React.FC = () => {
  const {
    back,
    go,
    containers,
    selectedContainerId,
    shipments,
    assignShipmentsToContainer,
  } = useDemo();

  const cnt =
    containers.find((c) => c.id === selectedContainerId) || containers[0];

  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>(
    cnt?.shipments?.length
      ? cnt.shipments.map((s) => s.id)
      : ["SHP-1005", "SHP-1006", "SHP-1007"]
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredShipments = shipments.filter(
    (s) =>
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.clientName.toLowerCase().includes(search.toLowerCase())
  );

  const selectedBoxes = shipments
    .filter((s) => selectedIds.includes(s.id))
    .reduce((sum, s) => sum + s.boxes, 0);

  const handleAdd = async () => {
    if (cnt) {
      await assignShipmentsToContainer(cnt.id, selectedIds);
    }
    go("34");
  };

  return (
    <ScreenLayout
      showBack
      onBack={back}
      title={cnt?.id || "C-001"}
      hasNav={false}
      footer={
        <div className="flex flex-col gap-2.5 w-full">
          <div
            className="h-[44px] px-4 rounded-[12px] flex items-center text-[14px] font-medium text-[var(--muted)]"
            style={{ backgroundColor: "var(--field)" }}
          >
            Selected {selectedBoxes} boxes
          </div>
          <Button
            variant="primary"
            className="w-full"
            onClick={handleAdd}
          >
            Add
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-3.5 pt-1 pb-4">
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
            className="w-full h-[48px] pl-11 pr-4 rounded-[14px] text-[15px] outline-none"
            style={{
              backgroundColor: "var(--field)",
              color: "var(--ink)",
              border: "none",
            }}
          />
        </div>

        <span className="text-[15px] font-bold text-[var(--ink)] tracking-tight pt-1">
          Received shipments
        </span>

        {/* Selectable Shipments */}
        <div className="flex flex-col gap-2 select-none">
          {filteredShipments.map((shp) => {
            const isChecked = selectedIds.includes(shp.id);
            const initials = shp.clientName
              .split(" ")
              .map((n) => n[0])
              .join("");

            return (
              <div
                key={shp.id}
                onClick={() => toggleSelect(shp.id)}
                className="p-3.5 rounded-[16px] flex items-center gap-3.5 cursor-pointer active:scale-[0.99] transition-all"
                style={{
                  backgroundColor: "var(--surface)",
                  boxShadow: "var(--shadow-subtle)",
                }}
              >
                {/* Checkbox */}
                <div
                  className="w-5 h-5 rounded-[6px] flex items-center justify-center shrink-0 transition-colors"
                  style={{
                    backgroundColor: isChecked
                      ? "var(--accent)"
                      : "var(--field)",
                  }}
                >
                  {isChecked && <Icon name="check" size={14} color="#FFFFFF" />}
                </div>

                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[13px] shrink-0"
                  style={{
                    backgroundColor: "var(--accent-tint)",
                    color: "var(--accent)",
                  }}
                >
                  {initials}
                </div>

                {/* Shipment info */}
                <div className="flex flex-col min-w-0">
                  <span className="text-[15px] font-bold text-[var(--ink)] truncate">
                    {shp.id}
                  </span>
                  <span className="text-[13px] text-[var(--muted)] truncate">
                    {shp.clientName}
                  </span>
                  <span className="text-[12px] text-[var(--placeholder)]">
                    {shp.boxes} boxes
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ScreenLayout>
  );
};
