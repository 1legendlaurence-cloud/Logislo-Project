import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Field } from "../components/Field";
import { Button } from "../components/Button";
import { PhotoTile } from "../components/PhotoTile";
import { SearchableSelect } from "../components/SearchableSelect";
import { useDemo } from "../context/Demo";

export const S59LogUnmatched: React.FC = () => {
  const { back, go, routes, unmatchedItems, logUnmatched } = useDemo();

  const routeOptions = routes.map((r) => r.name);
  const nextId = `U-00${unmatchedItems.length + 1}`;

  const [boxes, setBoxes] = useState("3");
  const [weightKg, setWeightKg] = useState("45");
  const [cbm, setCbm] = useState("0.8");
  const [markings, setMarkings] = useState(
    "Handwritten marking 'MK-DLA' in black ink"
  );
  const [route, setRoute] = useState(routeOptions[0] || "Guangzhou to Douala");
  const [hasPhoto, setHasPhoto] = useState(true);

  const handleSave = async () => {
    await logUnmatched({
      boxes: Number(boxes) || 3,
      weightKg: Number(weightKg) || 45,
      cbm: Number(cbm) || 0.8,
      route,
      markings,
    });
    go("30");
  };

  return (
    <ScreenLayout
      showBack
      onBack={back}
      title="Log unmatched cargo"
      hasNav={false}
      footer={
        <div className="flex flex-col gap-2.5 w-full">
          <Button
            variant="soft"
            className="w-full"
            onClick={() => go("54")}
          >
            Print {nextId} label
          </Button>
          <Button
            variant="primary"
            className="w-full"
            onClick={handleSave}
          >
            Save unmatched
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 pt-1 pb-4">
        {/* Info Banner */}
        <div
          className="p-3.5 rounded-[16px] text-[13px] text-[var(--muted)] leading-relaxed"
          style={{ backgroundColor: "var(--field)" }}
        >
          No matching pre-alert found. Log box markings and photos to generate tracking ID <strong className="text-[var(--ink)]">{nextId}</strong>.
        </div>

        {/* Route */}
        <SearchableSelect
          label="Route"
          placeholder="Select route"
          options={routeOptions.length ? routeOptions : ["Guangzhou to Douala"]}
          value={route}
          onChange={setRoute}
        />

        {/* Boxes */}
        <Field
          label="Number of boxes"
          placeholder="e.g. 3"
          value={boxes}
          onChange={(e) => setBoxes(e.target.value)}
        />

        {/* Weight & CBM */}
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Weight (kg)"
            placeholder="e.g. 45"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
          />
          <Field
            label="Estimated CBM"
            placeholder="e.g. 0.8"
            value={cbm}
            onChange={(e) => setCbm(e.target.value)}
          />
        </div>

        {/* Markings / Notes */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[13px] font-medium text-[var(--muted)] leading-none">
            Cargo markings & description
          </label>
          <textarea
            rows={3}
            value={markings}
            onChange={(e) => setMarkings(e.target.value)}
            placeholder="Describe any labels, handwritten codes, supplier tags..."
            className="w-full p-3.5 rounded-[14px] text-[15px] outline-none resize-none"
            style={{
              backgroundColor: "var(--field)",
              color: "var(--ink)",
              border: "none",
            }}
          />
        </div>

        {/* Photos of markings */}
        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-medium text-[var(--muted)]">
            Photos of box markings
          </span>
          <div className="grid grid-cols-3 gap-2.5">
            <PhotoTile
              hasPhoto={hasPhoto}
              label="Front"
              height={92}
              onClick={() => setHasPhoto(!hasPhoto)}
            />
            <PhotoTile
              hasPhoto={false}
              label="Side"
              height={92}
              onClick={() => {}}
            />
            <PhotoTile
              hasPhoto={false}
              label="Label"
              height={92}
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
    </ScreenLayout>
  );
};
