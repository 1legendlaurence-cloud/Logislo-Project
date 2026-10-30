import React from "react";
import { Icon } from "./Icon";
import { Button } from "./Button";
import { StatusChip } from "./Chip";
import { QrPlaceholder } from "./QrPlaceholder";
import { TrackingAndReceiptBrandHeader } from "./AgencyBrand";
import { Logo } from "./Logo";

export interface ReceiptData {
  receiptNumber: string;
  shipmentId: string;
  clientName: string;
  clientCode?: string;
  route: string;
  boxes: number;
  cbm?: number;
  weightKg?: number;
  paymentType: string;
  paymentMethod: string;
  amountPaid: number;
  shippingFee: number;
  depositFee: number;
  storageFee: number;
  remainingBalance: number;
  date: string;
  recordedBy: string;
  reference?: string;
  collectorName?: string;
  agencyName: string;
  agencyLogoUrl?: string;
  isWhiteLabeled: boolean;
  currency?: string;
  trackingUrl?: string;
}

interface ReceiptCardProps {
  data: ReceiptData;
  onOpenTracking?: () => void;
}

export const ReceiptCard: React.FC<ReceiptCardProps> = ({
  data,
  onOpenTracking,
}) => {
  const currency = data.currency || "FCFA";
  const qrPayload =
    data.trackingUrl || `https://track.logislo.com/${data.shipmentId}`;

  return (
    <div
      className="w-full rounded-[22px] p-5 flex flex-col gap-4 select-none"
      style={{
        backgroundColor: "var(--surface)",
        boxShadow: "var(--shadow-subtle)",
      }}
    >
      {/* Brand / Logo Header */}
      <TrackingAndReceiptBrandHeader
        agencyName={data.agencyName}
        agencyLogoUrl={data.agencyLogoUrl}
        isWhiteLabeled={data.isWhiteLabeled}
        subtitle="Issued by freight company"
        compact
      />

      {/* Receipt Title + Status */}
      <div className="flex items-center justify-between pt-1 border-b border-[var(--field)] pb-3">
        <div className="flex flex-col">
          <span className="text-[11px] font-mono font-semibold text-[var(--muted)] uppercase tracking-wider">
            Receipt #{data.receiptNumber}
          </span>
          <span className="text-[18px] font-extrabold text-[var(--ink)] tracking-tight mt-0.5">
            {data.amountPaid.toLocaleString()} {currency}
          </span>
        </div>

        <StatusChip
          status={data.remainingBalance <= 0 ? "Paid" : data.paymentType}
        />
      </div>

      {/* Shipment & Client Details */}
      <div className="grid grid-cols-2 gap-3 text-[13px] border-b border-[var(--field)] pb-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] text-[var(--muted)]">Client</span>
          <span className="font-bold text-[var(--ink)] truncate">
            {data.clientName}
          </span>
          {data.clientCode && (
            <span className="text-[11px] text-[var(--muted)]">
              {data.clientCode}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-0.5 text-right">
          <span className="text-[11px] text-[var(--muted)]">Shipment ID</span>
          <span className="font-extrabold text-[var(--ink)]">
            {data.shipmentId}
          </span>
          <span className="text-[11px] text-[var(--muted)]">
            {data.boxes} boxes · {data.cbm ?? 1} CBM
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] text-[var(--muted)]">Route</span>
          <span className="font-semibold text-[var(--ink)]">{data.route}</span>
        </div>

        <div className="flex flex-col gap-0.5 text-right">
          <span className="text-[11px] text-[var(--muted)]">Date & Method</span>
          <span className="font-semibold text-[var(--ink)]">
            {data.paymentMethod}
          </span>
          <span className="text-[11px] text-[var(--muted)]">{data.date}</span>
        </div>
      </div>

      {/* Financial Breakdown */}
      <div className="flex flex-col gap-2 text-[13px] border-b border-[var(--field)] pb-3">
        <div className="flex items-center justify-between">
          <span className="text-[var(--muted)]">Shipping fee</span>
          <span className="font-semibold text-[var(--ink)]">
            {data.shippingFee.toLocaleString()} {currency}
          </span>
        </div>

        {data.storageFee > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-[var(--muted)]">Storage fee</span>
            <span className="font-semibold text-[var(--ink)]">
              {data.storageFee.toLocaleString()} {currency}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-[var(--muted)]">
            Payment ({data.paymentType})
          </span>
          <span className="font-bold text-[var(--accent)]">
            {data.amountPaid.toLocaleString()} {currency}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1.5 border-t border-[var(--field)]">
          <span className="font-bold text-[var(--ink)]">Remaining balance</span>
          <span className="text-[15px] font-extrabold text-[var(--ink)]">
            {data.remainingBalance.toLocaleString()} {currency}
          </span>
        </div>
      </div>

      {/* Recorded By + Collector */}
      <div className="flex items-center justify-between text-[12px] text-[var(--muted)]">
        <span>Recorded by: {data.recordedBy}</span>
        {data.collectorName ? (
          <span>Collector: {data.collectorName}</span>
        ) : data.reference ? (
          <span>Ref: {data.reference}</span>
        ) : null}
      </div>

      {/* QR Code for Live Shipment Tracking */}
      <div
        onClick={onOpenTracking}
        className={`p-3 rounded-[16px] flex items-center justify-between gap-3 ${
          onOpenTracking ? "cursor-pointer active:scale-[0.99] transition-transform" : ""
        }`}
        style={{ backgroundColor: "var(--field)" }}
      >
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[12px] font-bold text-[var(--ink)]">
            Scan to track shipment
          </span>
          <span className="text-[11px] text-[var(--muted)] leading-snug">
            Scan QR code or tap to open live tracking for {data.shipmentId}
          </span>
          <span className="text-[11px] font-semibold text-[var(--accent)] truncate mt-0.5">
            {qrPayload}
          </span>
        </div>

        <div className="p-1.5 rounded-[12px] bg-white shrink-0">
          <QrPlaceholder size={68} value={qrPayload} />
        </div>
      </div>

      {/* Footer Attribution */}
      <div className="flex items-center justify-center pt-1">
        {data.isWhiteLabeled ? (
          <span className="text-[11px] font-semibold text-[var(--muted)]">
            Official Receipt · {data.agencyName}
          </span>
        ) : (
          <div className="flex items-center gap-1.5 opacity-80">
            <span className="text-[11px] font-medium text-[var(--muted)]">
              Powered by
            </span>
            <Logo size={14} showWordmark={true} />
          </div>
        )}
      </div>
    </div>
  );
};

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ReceiptData;
  onOpenTracking?: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  data,
  onOpenTracking,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const currency = data.currency || "FCFA";
    const text = encodeURIComponent(
      `Receipt #${data.receiptNumber} — ${data.agencyName}\n` +
        `Shipment: ${data.shipmentId} (${data.route})\n` +
        `Client: ${data.clientName}\n` +
        `Paid (${data.paymentType}): ${data.amountPaid.toLocaleString()} ${currency}\n` +
        `Remaining Balance: ${data.remainingBalance.toLocaleString()} ${currency}\n` +
        `Track live: ${data.trackingUrl || `https://track.logislo.com/${data.shipmentId}`}`
    );
    const link = document.createElement("a");
    link.href = `https://wa.me/?text=${text}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[400px] max-h-[92vh] rounded-[24px] bg-[var(--bg)] p-4 flex flex-col gap-3 shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-1">
          <span className="text-[16px] font-extrabold text-[var(--ink)]">
            Official Receipt
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--surface)] text-[var(--ink)] cursor-pointer"
          >
            <Icon name="close" size={16} />
          </button>
        </div>

        <ReceiptCard
          data={data}
          onOpenTracking={() => {
            onClose();
            onOpenTracking?.();
          }}
        />

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <Button variant="soft" size="sm" icon="printer" onClick={handlePrint}>
            Print / PDF
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon="whatsapp"
            onClick={handleWhatsAppShare}
          >
            WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
};
