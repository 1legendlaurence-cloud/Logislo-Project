import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Field } from "../components/Field";
import { Segmented } from "../components/Segmented";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { LockBadge } from "../components/Chip";
import { useDemo } from "../context/Demo";

export const S28Receive: React.FC = () => {
  const {
    back,
    go,
    plan,
    shipments,
    selectedShipmentId,
    setSelectedShipmentId,
    receiveShipment,
  } = useDemo();

  const [search, setSearch] = useState("");
  const matched =
    shipments.find(
      (s) =>
        search.trim().length > 0 &&
        (s.id.toLowerCase().includes(search.toLowerCase()) ||
          s.clientName.toLowerCase().includes(search.toLowerCase()) ||
          s.clientCode.toLowerCase().includes(search.toLowerCase()))
    ) ||
    shipments.find((s) => s.id === selectedShipmentId) ||
    shipments[0];

  const [boxes, setBoxes] = useState(String(matched?.boxes ?? 12));
  const [weightKg, setWeightKg] = useState(
    matched?.weightKg ? matched.weightKg.toLocaleString() : "1,000"
  );
  const [lengthCm, setLengthCm] = useState("");
  const [widthCm, setWidthCm] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [rateMode, setRateMode] = useState("kg");

  const isBasic = plan === "Basic";

  const handlePrintLabel = async () => {
    if (matched) {
      setSelectedShipmentId(matched.id);
      const parsedBoxes = Number(boxes.replace(/[^0-9]/g, "")) || matched.boxes;
      const parsedWeight =
        Number(weightKg.replace(/[^0-9.]/g, "")) || matched.weightKg || 420;
      await receiveShipment(matched.id, {
        boxes: parsedBoxes,
        weightKg: parsedWeight,
      });
    }
    go("54");
  };

  return (
    <ScreenLayout
      showBack
      onBack={back}
      title="Receive"
      hasNav={false}
    >
      <div className="flex flex-col gap-4 pt-1 pb-6">
        {/* Search Input with Scan Icon */}
        <div className="relative flex items-center w-full">
          <div className="absolute left-4 pointer-events-none text-[var(--muted)]">
            <Icon name="search" size={18} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full h-[50px] pl-11 pr-12 rounded-[14px] text-[15px] outline-none"
            style={{
              backgroundColor: "var(--field)",
              color: "var(--ink)",
              border: "none",
            }}
          />
          <button
            type="button"
            onClick={() => go("36")}
            className="absolute right-3 w-9 h-9 rounded-[10px] flex items-center justify-center cursor-pointer active:scale-95 text-[var(--accent)]"
            aria-label="Scan barcode"
          >
            <Icon name="scan" size={20} color="var(--accent)" />
          </button>
        </div>

        {/* Matched Shipment Card */}
        <div
          onClick={() => {
            if (matched) setSelectedShipmentId(matched.id);
            go("26");
          }}
          className="p-4 rounded-[18px] flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all select-none"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <div className="flex flex-col gap-1.5 min-w-0">
            <span
              className="px-2.5 py-0.5 rounded-full text-[11px] font-medium w-fit"
              style={{
                backgroundColor: "var(--accent-tint)",
                color: "var(--accent)",
              }}
            >
              Matched
            </span>
            <span className="text-[16px] font-bold text-[var(--ink)] truncate">
              {matched ? `${matched.id} · ${matched.clientName}` : "SHP-1005 · Jean Dupont"}
            </span>
            <span className="text-[13px] text-[var(--muted)]">
              {matched?.boxes ?? 12} boxes · {matched?.cbm ?? 10} CBM
            </span>
          </div>

          <Icon name="chevron-right" size={18} color="var(--muted)" />
        </div>

        {/* Inputs */}
        <Field
          label="Boxes"
          placeholder="12"
          value={boxes}
          onChange={(e) => setBoxes(e.target.value)}
        />

        <Field
          label="Weight (kg)"
          placeholder="1,000"
          value={weightKg}
          onChange={(e) => setWeightKg(e.target.value)}
        />

        {/* Length / Width / Height */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[13px] font-medium text-[var(--muted)] leading-none">
            Length / Width / Height (cm)
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            <input
              type="text"
              placeholder="L"
              value={lengthCm}
              onChange={(e) => setLengthCm(e.target.value)}
              className="w-full h-[52px] px-3 text-center rounded-[14px] text-[15px] outline-none"
              style={{
                backgroundColor: "var(--field)",
                color: "var(--ink)",
                border: "none",
              }}
            />
            <input
              type="text"
              placeholder="W"
              value={widthCm}
              onChange={(e) => setWidthCm(e.target.value)}
              className="w-full h-[52px] px-3 text-center rounded-[14px] text-[15px] outline-none"
              style={{
                backgroundColor: "var(--field)",
                color: "var(--ink)",
                border: "none",
              }}
            />
            <input
              type="text"
              placeholder="H"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              className="w-full h-[52px] px-3 text-center rounded-[14px] text-[15px] outline-none"
              style={{
                backgroundColor: "var(--field)",
                color: "var(--ink)",
                border: "none",
              }}
            />
          </div>
        </div>

        <Segmented
          options={["kg", "CBM"]}
          value={rateMode}
          onChange={setRateMode}
        />

        {/* Action Buttons Stack */}
        <div className="flex flex-col gap-2.5 pt-1">
          <Button
            variant="soft"
            icon="camera"
            className="w-full"
          >
            <span>Add photo</span>
            {isBasic && <LockBadge label="Pro" className="ml-1" />}
          </Button>

          <Button
            variant="primary"
            className="w-full"
            onClick={handlePrintLabel}
          >
            Print label
          </Button>

          <Button
            variant="soft"
            className="w-full"
            onClick={() => go("59")}
          >
            Unmatched
          </Button>
        </div>
      </div>
    </ScreenLayout>
  );
};
