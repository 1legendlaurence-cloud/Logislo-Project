import React, { useState, useRef } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Field } from "../components/Field";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { LockBadge } from "../components/Chip";
import {
  AgencyLogoMark,
  TrackingAndReceiptBrandHeader,
} from "../components/AgencyBrand";
import { useDemo } from "../context/Demo";

const PRESET_COLORS = [
  "#0B5FFF",
  "#0E1116",
  "#12B76A",
  "#7C3AED",
  "#E11D48",
];

export const S10Agency: React.FC = () => {
  const { back, go, plan, userProfile, updateProfile } = useDemo();
  const [agencyName, setAgencyName] = useState(userProfile.agencyName);
  const [logoUrl, setLogoUrl] = useState(
    userProfile.agencyLogoUrl || "preset:#0B5FFF"
  );
  const [whiteLabel, setWhiteLabel] = useState(
    Boolean(userProfile.whiteLabelEnabled)
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isPro = plan === "Pro";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 140;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          setLogoUrl(dataUrl);
        }
      };
      if (typeof ev.target?.result === "string") {
        img.src = ev.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleToggleWhiteLabel = () => {
    if (!isPro) {
      go("15");
      return;
    }
    setWhiteLabel((v) => !v);
  };

  const handleSave = async () => {
    await updateProfile({
      agencyName: agencyName.trim() || userProfile.agencyName || "Douala Express",
      agencyLogoUrl: logoUrl,
      whiteLabelEnabled: isPro ? whiteLabel : false,
    });
    back();
  };

  return (
    <ScreenLayout
      showBack
      onBack={back}
      title="Agency"
      hasNav={false}
      footer={
        <Button variant="primary" className="w-full" onClick={handleSave}>
          Save
        </Button>
      }
    >
      <div className="flex flex-col gap-4 pt-2 pb-6">
        <Field
          label="Agency name"
          placeholder="Douala Express"
          value={agencyName}
          onChange={(e) => setAgencyName(e.target.value)}
        />

        {/* Logo Upload & Brand Mark */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-medium text-[var(--muted)] leading-none">
              Agency logo
            </label>
            {!isPro && <LockBadge label="Pro for white-label" />}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex items-center gap-3.5">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-[120px] h-[104px] rounded-[16px] flex flex-col items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-transform select-none shrink-0"
              style={{ backgroundColor: "var(--field)" }}
            >
              <AgencyLogoMark
                agencyName={agencyName || "Agency"}
                logoUrl={logoUrl}
                size={46}
              />
              <span className="text-[11px] font-semibold text-[var(--accent)]">
                Upload image
              </span>
            </div>

            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <span className="text-[12px] text-[var(--muted)] leading-snug">
                Upload your company logo or pick a monogram badge color:
              </span>
              <div className="flex items-center gap-2">
                {PRESET_COLORS.map((color) => {
                  const presetVal = `preset:${color}`;
                  const selected = logoUrl === presetVal;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setLogoUrl(presetVal)}
                      className={`w-7 h-7 rounded-full cursor-pointer transition-transform ${
                        selected ? "scale-110 ring-2 ring-offset-2 ring-[var(--accent)]" : ""
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* White-Labeling Pro Feature Card */}
        <div
          onClick={handleToggleWhiteLabel}
          className="p-4 rounded-[18px] flex flex-col gap-2.5 cursor-pointer active:scale-[0.99] transition-all select-none"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: "var(--accent-tint)",
                  color: "var(--accent)",
                }}
              >
                <Icon name="crown" size={18} color="var(--accent)" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-bold text-[var(--ink)]">
                    White-label tracking & receipts
                  </span>
                  {!isPro && <LockBadge label="Pro" />}
                </div>
                <span className="text-[12px] text-[var(--muted)]">
                  Show your logo instead of Logislo
                </span>
              </div>
            </div>

            {isPro ? (
              <div
                className="w-12 h-7 rounded-full p-1 transition-colors flex items-center shrink-0"
                style={{
                  backgroundColor: whiteLabel ? "var(--accent)" : "var(--field)",
                }}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                    whiteLabel ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
            ) : (
              <span className="text-[12px] font-semibold text-[var(--accent)] shrink-0">
                Upgrade →
              </span>
            )}
          </div>
        </div>

        {/* Live Header Preview */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[12px] font-medium text-[var(--muted)]">
            Live preview on public tracking & receipts
          </span>
          <TrackingAndReceiptBrandHeader
            agencyName={agencyName || "Douala Express"}
            agencyLogoUrl={logoUrl}
            isWhiteLabeled={Boolean(isPro && whiteLabel)}
            compact
          />
        </div>

        {/* Currency Field */}
        <Field
          label="Currency"
          value={userProfile.currency || "FCFA"}
          isSelect
          readOnly
        />
      </div>
    </ScreenLayout>
  );
};
