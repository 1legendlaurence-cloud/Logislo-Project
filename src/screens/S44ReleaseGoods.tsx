import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { StatusChip } from "../components/Chip";
import { PhotoTile } from "../components/PhotoTile";
import { ReceiptModal, ReceiptData } from "../components/ReceiptModal";
import { useDemo } from "../context/Demo";

export const S44ReleaseGoods: React.FC = () => {
  const {
    back,
    go,
    role,
    showConfirm,
    shipments,
    selectedShipmentId,
    releaseShipment,
    userProfile,
    plan,
  } = useDemo();
  const shp =
    shipments.find((s) => s.id === selectedShipmentId) || shipments[0];
  const [collectorName, setCollectorName] = useState(shp?.clientName || "");
  const [receiptOpen, setReceiptOpen] = useState(false);

  const isWarehouse = role === "Warehouse worker";
  const isWhiteLabeled = Boolean(
    shp?.whiteLabelEnabled ?? (plan === "Pro" && userProfile.whiteLabelEnabled)
  );

  const receiptData: ReceiptData = {
    receiptNumber: `REL-${(shp?.id || "SHP-1001").replace("SHP-", "")}`,
    shipmentId: shp?.id || "SHP-1001",
    clientName: shp?.clientName || "Client",
    clientCode: shp?.clientCode,
    route: shp?.route || "Guangzhou to Douala",
    boxes: shp?.boxes || 1,
    cbm: shp?.cbm || 1,
    weightKg: shp?.weightKg || 50,
    paymentType: "Collected / Released",
    paymentMethod: "Cleared",
    amountPaid: shp?.shippingFee || 0,
    shippingFee: shp?.shippingFee || 0,
    depositFee: shp?.depositFee || 0,
    storageFee: shp?.storageFee || 0,
    remainingBalance: 0,
    date: "Today",
    recordedBy: userProfile.name || "Owner",
    collectorName: collectorName || shp?.clientName,
    agencyName: shp?.agencyName || userProfile.agencyName || "Douala Express",
    agencyLogoUrl: shp?.agencyLogoUrl || userProfile.agencyLogoUrl,
    isWhiteLabeled,
    currency: userProfile.currency || "FCFA",
    trackingUrl:
      shp?.trackingLink || `https://track.logislo.com/${shp?.id || "SHP-1001"}`,
  };

  const handleRelease = () => {
    const targetId = shp?.id || "SHP-1001";
    const collector = collectorName.trim() || shp?.clientName || "Authorized Collector";
    showConfirm({
      variant: "release",
      title: `Release ${targetId}?`,
      line1: `Collector: ${collector}`,
      cancelLabel: "Cancel",
      confirmLabel: "Release",
      onConfirm: async () => {
        await releaseShipment(targetId, collector);
        go("23");
      },
    });
  };

  return (
    <ScreenLayout
      showBack
      onBack={back}
      title="Release goods"
      hasNav={false}
      footer={
        <div className="flex flex-col gap-2 w-full">
          <Button variant="primary" className="w-full" onClick={handleRelease}>
            Release
          </Button>
          <Button
            variant="soft"
            icon="printer"
            className="w-full"
            onClick={() => setReceiptOpen(true)}
          >
            Release receipt
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 pt-1 pb-4">
        {/* Shipment & Balance Summary Card */}
        <div
          className="p-4 rounded-[18px] flex flex-col gap-3 select-none"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
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

            <StatusChip status="Ready" />
          </div>

          <div className="flex flex-col pt-1">
            <span className="text-[12px] font-medium text-[var(--muted)]">
              {isWarehouse ? "Status" : "Balance"}
            </span>
            <span className="text-[20px] font-extrabold text-[var(--ink)] mt-0.5">
              {isWarehouse ? "Cleared" : "0 FCFA"}
            </span>
          </div>
        </div>

        {/* Goods Photo Section */}
        <div className="flex flex-col gap-2 select-none">
          <span className="text-[14px] font-bold text-[var(--ink)]">
            Goods photo
          </span>
          <PhotoTile label="Release goods photo" hasPhoto height={160} />
        </div>

        {/* Collector Name Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-[var(--muted)] leading-none">
            Collector name
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-4 text-[var(--muted)] pointer-events-none">
              <Icon name="user" size={18} />
            </div>
            <input
              type="text"
              value={collectorName}
              onChange={(e) => setCollectorName(e.target.value)}
              placeholder="Collector full name"
              className="w-full h-[52px] pl-11 pr-4 rounded-[14px] text-[15px] font-medium outline-none"
              style={{
                backgroundColor: "var(--field)",
                color: "var(--ink)",
                border: "none",
              }}
            />
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
