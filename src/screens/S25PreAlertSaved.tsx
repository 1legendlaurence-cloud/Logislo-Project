import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { QrPlaceholder } from "../components/QrPlaceholder";
import { ReceiptModal, ReceiptData } from "../components/ReceiptModal";
import { useDemo } from "../context/Demo";

export const S25PreAlertSaved: React.FC = () => {
  const { go, shipments, selectedShipmentId, userProfile, plan } = useDemo();
  const [copied, setCopied] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const shp =
    shipments.find((s) => s.id === selectedShipmentId) || shipments[0];
  const shipmentId = shp?.id || "SHP-1001";
  const trackingUrl =
    shp?.trackingLink || `https://track.logislo.com/${shipmentId}`;
  const isWhiteLabeled = Boolean(
    shp?.whiteLabelEnabled ?? (plan === "Pro" && userProfile.whiteLabelEnabled)
  );

  const receiptData: ReceiptData = {
    receiptNumber: `PRE-${shipmentId.replace("SHP-", "")}`,
    shipmentId,
    clientName: shp?.clientName || "Client",
    clientCode: shp?.clientCode,
    route: shp?.route || "Guangzhou to Douala",
    boxes: shp?.boxes || 1,
    cbm: shp?.cbm || 1,
    weightKg: shp?.weightKg || 50,
    paymentType: "Pre-alert Estimate",
    paymentMethod: "Pending",
    amountPaid: 0,
    shippingFee: shp?.shippingFee || 0,
    depositFee: shp?.depositFee || 0,
    storageFee: 0,
    remainingBalance: shp?.shippingFee || 0,
    date: shp?.dateLabel || "Today",
    recordedBy: userProfile.name || "Owner",
    agencyName: shp?.agencyName || userProfile.agencyName || "Douala Express",
    agencyLogoUrl: shp?.agencyLogoUrl || userProfile.agencyLogoUrl,
    isWhiteLabeled,
    currency: userProfile.currency || "FCFA",
    trackingUrl,
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText?.(trackingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Track your shipment ${shipmentId} (${userProfile.agencyName}): ${trackingUrl}`
    );
    const link = document.createElement("a");
    link.href = `https://wa.me/?text=${text}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  };

  return (
    <ScreenLayout
      showBack
      onBack={() => go("23")}
      title="Pre-alert saved"
      hasNav={false}
      footer={
        <div className="flex flex-col gap-2.5 w-full">
          <Button
            variant="primary"
            icon="whatsapp"
            className="w-full"
            onClick={handleShareWhatsApp}
          >
            Share on WhatsApp
          </Button>
          <Button
            variant="soft"
            className="w-full"
            onClick={() => go("26")}
          >
            Done
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 pt-2 pb-4 select-none">
        {/* Top Hero Card with Generated QR */}
        <div
          className="p-6 rounded-[22px] flex flex-col items-center text-center gap-3"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: "var(--accent)",
              color: "#FFFFFF",
            }}
          >
            <Icon name="check" size={26} color="#FFFFFF" />
          </div>

          <h1 className="text-[26px] font-extrabold tracking-tight text-[var(--ink)] leading-none">
            {shipmentId}
          </h1>

          <span className="text-[13px] font-medium text-[var(--muted)]">
            {shp?.clientName} · {shp?.agencyName || userProfile.agencyName}
          </span>

          {/* Generated Scannable QR Code */}
          <div className="p-3 rounded-[16px] bg-white border border-[var(--field)] my-1">
            <QrPlaceholder
              size={128}
              value={trackingUrl}
              sublabel={shipmentId}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go("54")}
              className="px-3 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer"
              style={{
                backgroundColor: "var(--accent-tint)",
                color: "var(--accent)",
              }}
            >
              Print box label
            </button>
            <button
              type="button"
              onClick={() => setReceiptOpen(true)}
              className="px-3 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer"
              style={{
                backgroundColor: "var(--field)",
                color: "var(--ink)",
              }}
            >
              View receipt
            </button>
          </div>
        </div>

        {/* Tracking Link Card */}
        <div
          className="p-4 rounded-[18px] flex items-center justify-between gap-3"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-[12px] font-medium text-[var(--muted)]">
              Tracking link
            </span>
            <button
              type="button"
              onClick={() => go("49")}
              className="text-left text-[14px] font-medium text-[var(--accent)] truncate hover:underline cursor-pointer"
            >
              {trackingUrl}
            </button>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant="soft"
              size="sm"
              icon={copied ? "check" : "copy"}
              onClick={handleCopy}
            >
              {copied ? "Copied" : "Copy"}
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
