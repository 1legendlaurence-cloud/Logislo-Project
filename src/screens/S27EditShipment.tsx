import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Field } from "../components/Field";
import { Segmented } from "../components/Segmented";
import { Button } from "../components/Button";
import { useDemo } from "../context/Demo";

export const S27EditShipment: React.FC = () => {
  const { back, go, shipments, selectedShipmentId, updateShipment } = useDemo();

  const shp =
    shipments.find((s) => s.id === selectedShipmentId) || shipments[0];

  const [description, setDescription] = useState(
    shp?.description || "Electronics, clothing"
  );
  const [boxes, setBoxes] = useState(String(shp?.boxes ?? 12));
  const [weightKg, setWeightKg] = useState(
    shp?.weightKg ? shp.weightKg.toLocaleString() : "1,000"
  );
  const [lengthCm, setLengthCm] = useState("");
  const [widthCm, setWidthCm] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [rateMode, setRateMode] = useState("kg");

  const handleSave = async () => {
    const parsedBoxes = Number(boxes.replace(/[^0-9]/g, "")) || shp.boxes;
    const parsedWeight =
      Number(weightKg.replace(/[^0-9.]/g, "")) || shp.weightKg || 420;
    const l = Number(lengthCm) || 0;
    const w = Number(widthCm) || 0;
    const h = Number(heightCm) || 0;
    const cbm =
      l > 0 && w > 0 && h > 0
        ? Number(((l * w * h) / 1000000).toFixed(2))
        : shp.cbm;

    await updateShipment(shp.id, {
      description: description.trim() || shp.description,
      boxes: parsedBoxes,
      weightKg: parsedWeight,
      cbm,
    });
    go("26");
  };

  return (
    <ScreenLayout
      showBack
      onBack={back}
      title="Edit shipment"
      hasNav={false}
      footer={
        <Button variant="primary" className="w-full" onClick={handleSave}>
          Save
        </Button>
      }
    >
      <div className="flex flex-col gap-4 pt-2 pb-4">
        <Field
          label="Description"
          placeholder="Electronics, clothing"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

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

        <div className="pt-1">
          <Segmented
            options={["kg", "CBM"]}
            value={rateMode}
            onChange={setRateMode}
          />
        </div>
      </div>
    </ScreenLayout>
  );
};
