import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Field } from "../components/Field";
import { Segmented } from "../components/Segmented";
import { Button } from "../components/Button";
import { LockBadge } from "../components/Chip";
import { useDemo } from "../context/Demo";

export const S33NewContainer: React.FC = () => {
  const { back, go, plan, containers, addContainer } = useDemo();
  const [number, setNumber] = useState("");
  const [size, setSize] = useState<"20ft" | "40ft">("40ft");
  const [cost, setCost] = useState("");

  const isBasic = plan === "Basic";

  const handleCreate = async () => {
    const parsedCost = Number(cost.replace(/[^0-9]/g, "")) || 0;
    await addContainer({
      number: number.trim() || `C-00${containers.length + 1}`,
      size,
      route: "Guangzhou to Douala",
      cost: parsedCost,
    });
    go("34");
  };

  return (
    <ScreenLayout
      showBack
      onBack={back}
      title="New container"
      hasNav={false}
      footer={
        <Button variant="primary" className="w-full" onClick={handleCreate}>
          Create
        </Button>
      }
    >
      <div className="flex flex-col gap-4 pt-2 pb-4">
        <Field
          label="Container number"
          placeholder="e.g. C-001"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />

        {/* Size Toggle */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[13px] font-medium text-[var(--muted)] leading-none">
            Size
          </label>
          <Segmented
            options={["20ft", "40ft"]}
            value={size}
            onChange={(v) => setSize(v as "20ft" | "40ft")}
          />
        </div>

        {/* Route Field */}
        <Field
          label="Route"
          value="Guangzhou → Douala"
          isSelect
          readOnly
        />

        {/* Cost (optional) */}
        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-medium text-[var(--muted)] leading-none">
              Cost (optional)
            </label>
            {isBasic && <LockBadge label="Pro" />}
          </div>
          <div className={`relative flex items-center ${isBasic ? "opacity-60" : ""}`}>
            <input
              type="text"
              disabled={isBasic}
              placeholder="0"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="w-full h-[52px] px-4 pr-16 rounded-[14px] text-[15px] outline-none"
              style={{
                backgroundColor: "var(--field)",
                color: "var(--ink)",
                border: "none",
              }}
            />
            <span className="absolute right-4 text-[13px] text-[var(--muted)] pointer-events-none">
              FCFA
            </span>
          </div>
        </div>
      </div>
    </ScreenLayout>
  );
};
