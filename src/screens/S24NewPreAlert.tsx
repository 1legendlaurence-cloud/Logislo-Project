import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Field } from "../components/Field";
import { Segmented } from "../components/Segmented";
import { Button } from "../components/Button";
import { SearchableSelect } from "../components/SearchableSelect";
import { useDemo } from "../context/Demo";

export const S24NewPreAlert: React.FC = () => {
  const { back, go, clients, selectedClientId, routes, addShipment } = useDemo();

  const defaultClient =
    clients.find((c) => c.id === selectedClientId)?.name ||
    clients[0]?.name ||
    "Jean Dupont";

  const [client, setClient] = useState(defaultClient);
  const [description, setDescription] = useState("");
  const [supplierTracking, setSupplierTracking] = useState("");
  const [weightKg, setWeightKg] = useState("420");
  const [lengthCm, setLengthCm] = useState("");
  const [widthCm, setWidthCm] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [rateMode, setRateMode] = useState<"kg" | "CBM">("CBM");

  const clientOptions = clients.map((c) => c.name);
  const activeRoute = routes[0] || {
    pricePerKg: 1200,
    pricePerCbm: 45000,
    depositPct: 20,
  };

  const w = Number(weightKg.replace(/[^0-9.]/g, "")) || 420;
  const l = Number(lengthCm) || 0;
  const wi = Number(widthCm) || 0;
  const h = Number(heightCm) || 0;
  const computedCbm =
    l > 0 && wi > 0 && h > 0
      ? Number(((l * wi * h) / 1000000).toFixed(2))
      : 10;

  const estShipping =
    rateMode === "kg"
      ? Math.round(w * activeRoute.pricePerKg)
      : Math.round(computedCbm * activeRoute.pricePerCbm);
  const estDeposit = Math.round((estShipping * activeRoute.depositPct) / 100);

  const handleSave = async () => {
    await addShipment({
      clientName: client,
      description,
      supplierTracking,
      weightKg: w,
      cbm: computedCbm,
      boxes: 12,
      rateMode,
    });
    go("25");
  };

  return (
    <ScreenLayout
      showBack
      onBack={back}
      title="New pre-alert"
      hasNav={false}
      footer={
        <Button variant="primary" className="w-full" onClick={handleSave}>
          Save
        </Button>
      }
    >
      <div className="flex flex-col gap-4 pt-1 pb-4">
        {/* Client Selector */}
        <SearchableSelect
          label="Client"
          value={client}
          onChange={setClient}
          options={clientOptions}
          placeholder="Select client"
        />

        {/* Description Field */}
        <Field
          label="Description"
          placeholder="e.g. Electronics, clothing"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Supplier tracking number */}
        <Field
          label="Supplier tracking number"
          placeholder="e.g. 123456789"
          value={supplierTracking}
          onChange={(e) => setSupplierTracking(e.target.value)}
        />

        {/* Weight Field */}
        <Field
          label="Weight (kg)"
          placeholder="e.g. 1000"
          value={weightKg}
          onChange={(e) => setWeightKg(e.target.value)}
        />

        {/* Dimensions L / W / H */}
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

        {/* Rate mode toggle */}
        <div className="pt-1">
          <Segmented
            options={["kg", "CBM"]}
            value={rateMode}
            onChange={(v) => setRateMode(v as "kg" | "CBM")}
          />
        </div>

        {/* Estimate Card */}
        <div
          className="p-4 rounded-[16px] flex flex-col gap-2.5 select-none"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <span className="text-[13px] font-bold text-[var(--ink)]">
            Estimate
          </span>

          <div className="flex items-center justify-between text-[14px]">
            <span className="text-[var(--muted)]">Shipping</span>
            <span className="font-semibold text-[var(--ink)]">
              {estShipping.toLocaleString()} FCFA
            </span>
          </div>

          <div className="flex items-center justify-between text-[14px]">
            <span className="text-[var(--muted)]">Deposit</span>
            <span className="font-semibold text-[var(--ink)]">
              {estDeposit.toLocaleString()} FCFA
            </span>
          </div>
        </div>
      </div>
    </ScreenLayout>
  );
};
