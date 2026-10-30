import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Button } from "../components/Button";
import { ReceiptCard, ReceiptModal, ReceiptData } from "../components/ReceiptModal";
import { useDemo } from "../context/Demo";

export const S42PaymentDetail: React.FC = () => {
  const {
    go,
    payments,
    selectedPaymentId,
    shipments,
    selectedShipmentId,
    setSelectedShipmentId,
    userProfile,
    plan,
  } = useDemo();

  const [modalOpen, setModalOpen] = useState(false);

  const payment =
    payments.find((p) => p.id === selectedPaymentId) || payments[0];
  const targetShipmentId = payment?.shipmentId || selectedShipmentId;
  const shp =
    shipments.find((s) => s.id === targetShipmentId) || shipments[0];

  const isWhiteLabeled = Boolean(
    shp?.whiteLabelEnabled ?? (plan === "Pro" && userProfile.whiteLabelEnabled)
  );

  const receiptData: ReceiptData = {
    receiptNumber: payment?.id || "RCP-1001",
    shipmentId: shp?.id || payment?.shipmentId || "SHP-1001",
    clientName: shp?.clientName || payment?.clientName || "Client",
    clientCode: shp?.clientCode,
    route: shp?.route || "Guangzhou to Douala",
    boxes: shp?.boxes || 1,
    cbm: shp?.cbm || 1,
    weightKg: shp?.weightKg || 50,
    paymentType: payment?.type || "Deposit",
    paymentMethod: payment?.method || "Cash",
    amountPaid: payment?.amount ?? shp?.depositFee ?? 0,
    shippingFee: shp?.shippingFee ?? 0,
    depositFee: shp?.depositFee ?? 0,
    storageFee: shp?.storageFee ?? 0,
    remainingBalance: payment?.remaining ?? shp?.balance ?? 0,
    date: payment?.date || "Today",
    recordedBy: payment?.recordedBy || userProfile.name || "Owner",
    reference: payment?.reference,
    collectorName: shp?.collectorName,
    agencyName: shp?.agencyName || userProfile.agencyName || "Douala Express",
    agencyLogoUrl: shp?.agencyLogoUrl || userProfile.agencyLogoUrl,
    isWhiteLabeled,
    currency: userProfile.currency || "FCFA",
    trackingUrl:
      shp?.trackingLink ||
      `https://track.logislo.com/${shp?.id || payment?.shipmentId || "SHP-1001"}`,
  };

  const handleOpenTracking = () => {
    setSelectedShipmentId(receiptData.shipmentId);
    go("49");
  };

  const handleWhatsAppShare = () => {
    const currency = receiptData.currency || "FCFA";
    const text = encodeURIComponent(
      `Receipt #${receiptData.receiptNumber} — ${receiptData.agencyName}\n` +
        `Shipment: ${receiptData.shipmentId} (${receiptData.route})\n` +
        `Client: ${receiptData.clientName}\n` +
        `Paid (${receiptData.paymentType}): ${receiptData.amountPaid.toLocaleString()} ${currency}\n` +
        `Remaining Balance: ${receiptData.remainingBalance.toLocaleString()} ${currency}\n` +
        `Track live: ${receiptData.trackingUrl}`
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
      onBack={() => go("39")}
      title="Payment receipt"
      hasNav={false}
      footer={
        <div className="grid grid-cols-2 gap-2.5 w-full">
          <Button
            variant="soft"
            icon="printer"
            onClick={() => window.print()}
          >
            Print receipt
          </Button>
          <Button
            variant="primary"
            icon="whatsapp"
            onClick={handleWhatsAppShare}
          >
            Share receipt
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 pt-1 pb-4 select-none">
        <ReceiptCard
          data={receiptData}
          onOpenTracking={handleOpenTracking}
        />

        <ReceiptModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          data={receiptData}
          onOpenTracking={handleOpenTracking}
        />
      </div>
    </ScreenLayout>
  );
};
