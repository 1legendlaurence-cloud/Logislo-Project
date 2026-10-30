import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Icon } from "../components/Icon";
import { StatusChip, LockBadge } from "../components/Chip";
import { PhotoTile } from "../components/PhotoTile";
import { Button } from "../components/Button";
import { QrPlaceholder } from "../components/QrPlaceholder";
import { ReceiptModal, ReceiptData } from "../components/ReceiptModal";
import { useDemo } from "../context/Demo";

const TIMELINE_STEPS = [
  { status: "Expected", date: "Today", completed: true, current: true },
  { status: "Received", date: "—", completed: false, current: false },
  { status: "In transit", date: "—", completed: false, current: false },
  { status: "Arrived", date: "—", completed: false, current: false },
  { status: "Ready", date: "—", completed: false, current: false },
  { status: "Collected", date: "—", completed: false, current: false },
];

export const S26ShipmentDetail: React.FC = () => {
  const {
    back,
    go,
    plan,
    shipments,
    selectedShipmentId,
    clients,
    setSelectedClientId,
    payments,
    userProfile,
  } = useDemo();
  const [copied, setCopied] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const shp =
    shipments.find((s) => s.id === selectedShipmentId) || shipments[0];

  if (!shp) {
    return (
      <ScreenLayout showBack onBack={back} title="Shipment detail" hasNav={false}>
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3 select-none">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--accent-tint)" }}
          >
            <Icon name="box" size={24} color="var(--accent)" />
          </div>
          <span className="text-[17px] font-bold text-[var(--ink)]">
            No shipment selected
          </span>
          <p className="text-[13px] text-[var(--muted)] max-w-[240px]">
            Create a new pre-alert to generate a shipment and tracking QR code.
          </p>
          <Button variant="primary" size="sm" onClick={() => go("24")}>
            New pre-alert
          </Button>
        </div>
      </ScreenLayout>
    );
  }

  const trackingUrl =
    shp.trackingLink || `https://track.logislo.com/${shp.id}`;
  const isBasic = plan === "Basic";
  const isReleaseLocked = (shp.balance || 0) > 0;
  const isWhiteLabeled = Boolean(
    shp.whiteLabelEnabled ?? (plan === "Pro" && userProfile.whiteLabelEnabled)
  );

  const steps = shp.timeline?.length ? shp.timeline : TIMELINE_STEPS;
  const routeParts = shp.route ? shp.route.split(/→| to /i) : [];
  const fromCity = routeParts[0]?.trim() || "Guangzhou";
  const toCity = routeParts[1]?.trim() || "Douala";

  const latestPayment = payments.find((p) => p.shipmentId === shp.id);

  const receiptData: ReceiptData = {
    receiptNumber: latestPayment?.id || `RCP-${shp.id.replace("SHP-", "")}`,
    shipmentId: shp.id,
    clientName: shp.clientName,
    clientCode: shp.clientCode,
    route: shp.route,
    boxes: shp.boxes,
    cbm: shp.cbm,
    weightKg: shp.weightKg,
    paymentType: latestPayment?.type || (shp.balance <= 0 ? "Paid" : "Deposit"),
    paymentMethod: latestPayment?.method || "Cash",
    amountPaid: latestPayment?.amount ?? shp.depositFee,
    shippingFee: shp.shippingFee,
    depositFee: shp.depositFee,
    storageFee: shp.storageFee,
    remainingBalance: shp.balance,
    date: latestPayment?.date || shp.dateLabel || "Today",
    recordedBy: latestPayment?.recordedBy || userProfile.name || "Owner",
    collectorName: shp.collectorName,
    agencyName: shp.agencyName || userProfile.agencyName || "Douala Express",
    agencyLogoUrl: shp.agencyLogoUrl || userProfile.agencyLogoUrl,
    isWhiteLabeled,
    currency: userProfile.currency || "FCFA",
    trackingUrl,
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText?.(trackingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Track shipment ${shp.id} (${shp.agencyName || userProfile.agencyName}): ${trackingUrl}`
    );
    const link = document.createElement("a");
    link.href = `https://wa.me/?text=${text}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  };

  const handleClientClick = () => {
    const foundClient = clients.find(
      (c) => c.name === shp.clientName || c.code === shp.clientCode
    );
    if (foundClient) {
      setSelectedClientId(foundClient.id);
    }
    go("21");
  };

  return (
    <ScreenLayout
      showBack
      onBack={back}
      rightIcon="pencil"
      onRightAction={() => go("27")}
      hasNav={false}
      headerChildren={
        <div className="flex items-center gap-3">
          <span className="text-[22px] font-extrabold tracking-tight text-[var(--ink)]">
            {shp.id}
          </span>
          <StatusChip status={shp.status} />
        </div>
      }
      footer={
        isReleaseLocked ? (
          <button
            type="button"
            onClick={() => go("43")}
            className="w-full h-[52px] rounded-[14px] flex items-center justify-center gap-2 font-semibold text-[15px] cursor-pointer active:scale-[0.98] transition-all select-none"
            style={{
              backgroundColor: "var(--field)",
              color: "var(--muted)",
            }}
          >
            <Icon name="lock" size={16} color="var(--muted)" />
            <span>Release</span>
          </button>
        ) : (
          <Button
            variant="primary"
            className="w-full"
            onClick={() => go("44")}
          >
            Release
          </Button>
        )
      }
    >
      <div className="flex flex-col gap-5 pt-1 pb-4">
        {/* Top Metadata */}
        <div className="flex items-start justify-between gap-3 select-none">
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={handleClientClick}
              className="text-left text-[15px] font-medium text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer w-fit"
            >
              {shp.clientName} · {shp.clientCode}
            </button>

            <div className="flex items-center gap-1.5 text-[14px] text-[var(--muted)]">
              <span>{fromCity}</span>
              <Icon name="arrow-right" size={14} color="var(--muted)" />
              <span>{toCity}</span>
            </div>

            <div className="flex items-center gap-2 text-[14px] font-medium text-[var(--ink)] mt-0.5">
              <Icon name="box" size={16} color="var(--ink)" />
              <span>
                {shp.boxes} boxes · {shp.cbm ?? 1} CBM
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => go("54")}
            className="p-2 rounded-[14px] flex flex-col items-center gap-1 cursor-pointer active:scale-95 transition-transform"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
            title="View & print box QR labels"
          >
            <QrPlaceholder size={56} value={trackingUrl} />
            <span className="text-[10px] font-semibold text-[var(--accent)]">
              QR Label
            </span>
          </button>
        </div>

        {/* Horizontal & Stepper Timeline */}
        <div
          className="p-4 rounded-[18px] flex flex-col gap-3 select-none"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <div className="grid grid-cols-6 gap-1 items-start">
            {steps.map((step, i) => {
              const isLast = i === steps.length - 1;
              return (
                <div
                  key={step.status}
                  className="flex flex-col items-center text-center relative"
                >
                  {!isLast && (
                    <div
                      className="absolute top-[9px] left-1/2 w-full h-[2px] z-0"
                      style={{
                        backgroundColor: step.completed
                          ? "var(--accent)"
                          : "var(--field)",
                      }}
                    />
                  )}

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center z-10 ${
                      step.current ? "ring-4 ring-[var(--accent-tint)]" : ""
                    }`}
                    style={{
                      backgroundColor:
                        step.completed || step.current
                          ? "var(--accent)"
                          : "var(--field)",
                    }}
                  >
                    {step.completed ? (
                      <Icon name="check" size={11} color="#FFFFFF" />
                    ) : (
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: step.current
                            ? "#FFFFFF"
                            : "var(--placeholder)",
                        }}
                      />
                    )}
                  </div>

                  <span
                    className={`text-[10px] leading-tight mt-2 ${
                      step.current
                        ? "font-bold text-[var(--accent)]"
                        : step.completed
                        ? "font-medium text-[var(--ink)]"
                        : "font-normal text-[var(--muted)]"
                    }`}
                  >
                    {step.status}
                  </span>

                  <span className="text-[9px] text-[var(--placeholder)] mt-0.5">
                    {step.date.split(",")[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Photos Section */}
        <div className="flex flex-col gap-2.5 select-none">
          <div className="flex items-center justify-between">
            <span className="text-[17px] font-bold text-[var(--ink)] tracking-tight">
              Photos
            </span>
            {isBasic && <LockBadge label="Pro" />}
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <PhotoTile label="Box 1" hasPhoto height={106} />
            <PhotoTile label="Box 2" hasPhoto height={106} />
            <PhotoTile label="Add photo" height={106} />
          </div>
        </div>

        {/* Payment & Receipt Card */}
        <div
          className="p-4 rounded-[18px] flex flex-col gap-3 select-none"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-bold text-[var(--ink)]">
              Payment & Receipt
            </span>
            <button
              type="button"
              onClick={() => setReceiptOpen(true)}
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer"
              style={{
                backgroundColor: "var(--accent-tint)",
                color: "var(--accent)",
              }}
            >
              Official receipt
            </button>
          </div>

          <div
            onClick={() => go(isReleaseLocked ? "41" : "42")}
            className="flex items-center justify-between cursor-pointer active:opacity-80"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "var(--field)",
                  color: "var(--ink)",
                }}
              >
                <Icon name="credit-card" size={16} color="var(--ink)" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-medium text-[var(--ink)]">
                  {shp.balance > 0 ? "Remaining balance" : "Paid in full"}
                </span>
                <span className="text-[12px] text-[var(--muted)]">
                  Deposit: {shp.depositFee.toLocaleString()} FCFA
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold text-[var(--ink)]">
                {(shp.balance > 0 ? shp.balance : shp.shippingFee).toLocaleString()} FCFA
              </span>
              <Icon name="chevron-right" size={16} color="var(--muted)" />
            </div>
          </div>
        </div>

        {/* Tracking Link Card */}
        <div
          className="p-4 rounded-[18px] flex flex-col gap-3 select-none"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[14px] font-bold text-[var(--ink)]">
                Tracking link ({shp.agencyName || userProfile.agencyName})
              </span>
              <button
                type="button"
                onClick={() => go("49")}
                className="text-left text-[13px] text-[var(--accent)] font-medium truncate hover:underline cursor-pointer"
              >
                {trackingUrl}
              </button>
            </div>
            <button
              type="button"
              onClick={() => go("49")}
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 cursor-pointer"
              style={{
                backgroundColor: "var(--accent-tint)",
                color: "var(--accent)",
              }}
            >
              Open page
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <Button
              variant="soft"
              size="sm"
              icon={copied ? "check" : "copy"}
              onClick={handleCopy}
            >
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button
              variant="soft"
              size="sm"
              icon="whatsapp"
              onClick={handleWhatsApp}
            >
              WhatsApp
            </Button>
          </div>
        </div>
      </div>

      <ReceiptModal
        isOpen={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        data={receiptData}
        onOpenTracking={() => go("49")}
      />
    </ScreenLayout>
  );
};
