import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { QrPlaceholder } from "../components/QrPlaceholder";
import { Logo } from "../components/Logo";
import { AgencyLogoMark } from "../components/AgencyBrand";
import { useDemo } from "../context/Demo";

export const S54LabelPreview: React.FC = () => {
  const { back, go, shipments, selectedShipmentId, userProfile, plan } = useDemo();

  const shp =
    shipments.find((s) => s.id === selectedShipmentId) || shipments[0];
  const shipmentId = shp?.id || "SHP-1001";
  const clientCode = shp?.clientCode || "CLI-001";
  const totalBoxes = Math.max(1, shp?.boxes || 1);
  const [boxIndex, setBoxIndex] = useState(1);

  const isWhiteLabeled = Boolean(
    shp?.whiteLabelEnabled ?? (plan === "Pro" && userProfile.whiteLabelEnabled)
  );
  const agencyName =
    shp?.agencyName || userProfile.agencyName || "Douala Express";

  const routeParts = shp?.route ? shp.route.split(/→| to /i) : [];
  const fromCity = routeParts[0]?.trim() || "Guangzhou";
  const toCity = routeParts[1]?.trim() || "Douala";

  // Unique QR payload for each individual box in the shipment
  const boxQrPayload = `${shipmentId}|BOX-${boxIndex}/${totalBoxes}|${clientCode}`;
  const shortVerificationCode = `${shipmentId.replace("SHP-", "")}-B${String(
    boxIndex
  ).padStart(2, "0")}`;

  const handlePrev = () => {
    setBoxIndex((prev) => (prev > 1 ? prev - 1 : totalBoxes));
  };

  const handleNext = () => {
    setBoxIndex((prev) => (prev < totalBoxes ? prev + 1 : 1));
  };

  return (
    <ScreenLayout
      showBack
      onBack={back}
      title="Label"
      hasNav={false}
      footer={
        <div className="flex flex-col gap-2.5 w-full">
          <Button
            variant="primary"
            icon="printer"
            className="w-full"
            onClick={() => window.print()}
          >
            Print all ({totalBoxes})
          </Button>
          <Button
            variant="soft"
            className="w-full"
            onClick={() => go("29")}
          >
            Done
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center gap-4 pt-2 pb-4 select-none">
        {/* Centered Portrait Label Card */}
        <div
          className="w-full max-w-[320px] p-6 rounded-[22px] flex flex-col items-center text-center gap-3.5"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          {/* Agency & Brand Header on Label */}
          <div className="w-full flex items-center justify-between pb-2.5 border-b border-[var(--field)]">
            {isWhiteLabeled ? (
              <div className="flex items-center gap-2">
                <AgencyLogoMark
                  agencyName={agencyName}
                  logoUrl={shp?.agencyLogoUrl || userProfile.agencyLogoUrl}
                  size={24}
                />
                <span className="text-[13px] font-bold text-[var(--ink)] truncate max-w-[160px]">
                  {agencyName}
                </span>
              </div>
            ) : (
              <Logo size={18} showWordmark={true} />
            )}
            <span className="text-[11px] font-semibold text-[var(--muted)] truncate max-w-[120px]">
              {agencyName}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[26px] font-extrabold tracking-tight text-[var(--ink)] leading-none">
              {shipmentId}
            </span>
            <span className="text-[15px] font-bold text-[var(--muted)]">
              {shp?.clientName ? `${shp.clientName} · ${clientCode}` : clientCode}
            </span>
          </div>

          {/* Route Line */}
          <div className="flex items-center gap-2 text-[13px] font-medium text-[var(--muted)]">
            <span>{fromCity}</span>
            <Icon name="arrow-right" size={14} color="var(--muted)" />
            <span>{toCity}</span>
          </div>

          {/* Real Deterministic Box QR Code */}
          <div className="py-1">
            <QrPlaceholder size={144} value={boxQrPayload} />
          </div>

          {/* Short Barcode Verification Code */}
          <span className="text-[12px] font-mono font-semibold tracking-widest text-[var(--muted)]">
            {shortVerificationCode}
          </span>

          {/* Large Box Counter */}
          <span className="text-[24px] font-extrabold text-[var(--ink)] leading-none">
            {boxIndex}/{totalBoxes}
          </span>
        </div>

        {/* Stepper Below Card */}
        <div className="flex items-center gap-5 pt-1">
          <button
            type="button"
            onClick={handlePrev}
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
            style={{ backgroundColor: "var(--field)" }}
            aria-label="Previous label"
          >
            <Icon name="chevron-left" size={18} color="var(--ink)" />
          </button>

          <span className="text-[15px] font-bold text-[var(--ink)] min-w-[60px] text-center">
            {boxIndex} / {totalBoxes}
          </span>

          <button
            type="button"
            onClick={handleNext}
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
            style={{ backgroundColor: "var(--field)" }}
            aria-label="Next label"
          >
            <Icon name="chevron-right" size={18} color="var(--ink)" />
          </button>
        </div>
      </div>
    </ScreenLayout>
  );
};
