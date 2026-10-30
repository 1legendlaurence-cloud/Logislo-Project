import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { ReceiptModal, ReceiptData } from "../components/ReceiptModal";
import { useDemo } from "../context/Demo";

export const S41FinalBill: React.FC = () => {
  const { back, go, shipments, selectedShipmentId, userProfile, plan } = useDemo();
  const [receiptOpen, setReceiptOpen] = useState(false);

  const shp =
    shipments.find((s) => s.id === selectedShipmentId) || shipments[0];

  const isWhiteLabeled = Boolean(
    shp?.whiteLabelEnabled ?? (plan === "Pro" && userProfile.whiteLabelEnabled)
  );

  const receiptData: ReceiptData = {
    receiptNumber: `INV-${(shp?.id || "SHP-1001").replace("SHP-", "")}`,
    shipmentId: shp?.id || "SHP-1001",
    clientName: shp?.clientName || "Client",
    clientCode: shp?.clientCode,
    route: shp?.route || "Guangzhou to Douala",
    boxes: shp?.boxes || 1,
    cbm: shp?.cbm || 1,
    weightKg: shp?.weightKg || 50,
    paymentType: "Invoice / Balance Due",
    paymentMethod: "Pending",
    amountPaid: shp?.depositFee || 0,
    shippingFee: shp?.shippingFee || 0,
    depositFee: shp?.depositFee || 0,
    storageFee: shp?.storageFee || 0,
    remainingBalance: shp?.balance || 0,
    date: shp?.dateLabel || "Today",
    recordedBy: userProfile.name || "Owner",
    agencyName: shp?.agencyName || userProfile.agencyName || "Douala Express",
    agencyLogoUrl: shp?.agencyLogoUrl || userProfile.agencyLogoUrl,
    isWhiteLabeled,
    currency: userProfile.currency || "FCFA",
    trackingUrl:
      shp?.trackingLink || `https://track.logislo.com/${shp?.id || "SHP-1001"}`,
  };

  return (
    <ScreenLayout
      showBack
      onBack={back}
      title="Final bill"
      hasNav={false}
      footer={
        <div className="flex flex-col gap-2 w-full">
          <Button
            variant="primary"
            icon="credit-card"
            className="w-full"
            onClick={() => go("40")}
          >
            Record payment
          </Button>
          <Button
            variant="soft"
            icon="printer"
            className="w-full"
            onClick={() => setReceiptOpen(true)}
          >
            View invoice / receipt
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 pt-1 pb-4 select-none">
        {/* Shipment Header Card */}
        <div
          className="p-4 rounded-[18px] flex items-center justify-between gap-3.5"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <div className="flex items-center gap-3.5">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
              style={{
                backgroundColor: "var(--accent-tint)",
                color: "var(--accent)",
              }}
            >
              <Icon name="box" size={20} color="var(--accent)" />
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] font-bold text-[var(--ink)]">
                {shp?.id || "SHP-1001"}
              </span>
              <span className="text-[13px] text-[var(--muted)]">
                {shp?.clientName || "Client"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setReceiptOpen(true)}
            className="px-3 py-1 rounded-full text-[11px] font-semibold cursor-pointer"
            style={{
              backgroundColor: "var(--accent-tint)",
              color: "var(--accent)",
            }}
          >
            Receipt
          </button>
        </div>

        {/* Invoice Breakdown Card */}
        <div
          className="p-4 rounded-[18px] flex flex-col gap-4"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          {/* Shipping Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "var(--field)",
                  color: "var(--ink)",
                }}
              >
                <Icon name="truck" size={16} color="var(--ink)" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold text-[var(--ink)]">
                  Shipping
                </span>
                <span className="text-[12px] text-[var(--muted)]">
                  {shp?.cbm ?? 1} CBM · {shp?.boxes ?? 1} boxes
                </span>
              </div>
            </div>
            <span className="text-[15px] font-bold text-[var(--ink)]">
              {(shp?.shippingFee ?? 0).toLocaleString()}
            </span>
          </div>

          {/* Storage Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "var(--field)",
                  color: "var(--accent)",
                }}
              >
                <Icon name="home" size={16} color="var(--accent)" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold text-[var(--ink)]">
                  Storage
                </span>
                <span className="text-[12px] text-[var(--muted)]">
                  Warehouse storage fee
                </span>
              </div>
            </div>
            <span className="text-[15px] font-bold text-[var(--ink)]">
              {(shp?.storageFee ?? 0).toLocaleString()}
            </span>
          </div>

          {/* Deposit Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "var(--field)",
                  color: "var(--accent)",
                }}
              >
                <Icon name="credit-card" size={16} color="var(--accent)" />
              </div>
              <span className="text-[15px] font-semibold text-[var(--ink)]">
                Deposit
              </span>
            </div>
            <span className="text-[15px] font-bold text-[var(--alert)]">
              -{(shp?.depositFee ?? 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Total Balance Card */}
        <div
          className="p-4 rounded-[18px] flex flex-col gap-2"
          style={{
            backgroundColor: "var(--field)",
          }}
        >
          <span className="text-[14px] font-bold text-[var(--ink)]">
            Total
          </span>
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-medium text-[var(--muted)]">
              Balance
            </span>
            <span className="text-[20px] font-extrabold text-[var(--ink)]">
              {(shp?.balance ?? 0).toLocaleString()} FCFA
            </span>
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
