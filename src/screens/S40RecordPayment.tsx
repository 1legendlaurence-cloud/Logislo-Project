import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Field } from "../components/Field";
import { Segmented } from "../components/Segmented";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { StatusChip } from "../components/Chip";
import { useDemo } from "../context/Demo";

export const S40RecordPayment: React.FC = () => {
  const { back, go, shipments, selectedShipmentId, recordPayment } = useDemo();

  const shp =
    shipments.find((s) => s.id === selectedShipmentId) || shipments[0];

  const [paymentType, setPaymentType] = useState<"Deposit" | "Balance" | "Storage">("Balance");
  const [amount, setAmount] = useState(
    (shp?.balance && shp.balance > 0 ? shp.balance : 370000).toLocaleString()
  );
  const [method, setMethod] = useState<"Cash" | "Mobile money">("Cash");
  const [reference, setReference] = useState("");

  const handleSave = async () => {
    const parsedAmount =
      Number(amount.replace(/[^0-9]/g, "")) || shp?.balance || 370000;
    await recordPayment({
      shipmentId: shp?.id || "SHP-1005",
      type: paymentType,
      method,
      amount: parsedAmount,
      reference,
    });
    go("42");
  };

  return (
    <ScreenLayout
      showBack
      onBack={back}
      title="Record payment"
      hasNav={false}
      footer={
        <Button variant="primary" className="w-full" onClick={handleSave}>
          Save
        </Button>
      }
    >
      <div className="flex flex-col gap-4 pt-1 pb-4">
        {/* Shipment Summary Card */}
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
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "var(--accent-tint)",
                  color: "var(--accent)",
                }}
              >
                <Icon name="box" size={18} color="var(--accent)" />
              </div>
              <div className="flex flex-col">
                <span className="text-[16px] font-bold text-[var(--ink)]">
                  {shp?.id || "SHP-1005"}
                </span>
                <span className="text-[13px] text-[var(--muted)]">
                  {shp?.clientName || "Jean Dupont"}
                </span>
              </div>
            </div>

            <StatusChip status="Balance" />
          </div>

          <div className="flex flex-col pt-1">
            <span className="text-[12px] font-medium text-[var(--muted)]">
              Balance
            </span>
            <span className="text-[20px] font-bold text-[var(--ink)] mt-0.5">
              {(shp?.balance ?? 370000).toLocaleString()} FCFA
            </span>
          </div>
        </div>

        {/* Payment Type Segmented */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-[var(--muted)] leading-none">
            Payment type
          </label>
          <Segmented
            options={["Deposit", "Balance", "Storage"]}
            value={paymentType}
            onChange={(v) => setPaymentType(v as "Deposit" | "Balance" | "Storage")}
          />
        </div>

        {/* Amount Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-[var(--muted)] leading-none">
            Amount
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-[52px] px-4 pr-16 rounded-[14px] text-[16px] font-semibold outline-none"
              style={{
                backgroundColor: "var(--field)",
                color: "var(--ink)",
                border: "none",
              }}
            />
            <span className="absolute right-4 text-[13px] font-medium text-[var(--muted)] pointer-events-none">
              FCFA
            </span>
          </div>
        </div>

        {/* Payment Method Segmented */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-[var(--muted)] leading-none">
            Payment method
          </label>
          <Segmented
            options={["Cash", "Mobile money"]}
            value={method}
            onChange={(v) => setMethod(v as "Cash" | "Mobile money")}
          />
        </div>

        {/* Reference (optional) */}
        <Field
          label="Reference (optional)"
          placeholder="e.g. Transaction ID, phone number..."
          value={reference}
          onChange={(e) => setReference(e.target.value)}
        />
      </div>
    </ScreenLayout>
  );
};
