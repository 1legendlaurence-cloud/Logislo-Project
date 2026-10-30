import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { StatusChip } from "../components/Chip";
import { useDemo } from "../context/Demo";

type ContainerState = "Open" | "In transit" | "Arrived";

export const S34ContainerDetail: React.FC = () => {
  const {
    back,
    go,
    showConfirm,
    containers,
    selectedContainerId,
    shipments,
    setSelectedShipmentId,
    updateContainer,
  } = useDemo();

  const cnt =
    containers.find((c) => c.id === selectedContainerId) || containers[0];

  const status = (cnt?.status || "Open") as ContainerState;
  const [editingCost, setEditingCost] = useState(false);
  const [costAmount, setCostAmount] = useState(
    (cnt?.cost ?? 3200000).toLocaleString()
  );

  const containerShipmentIds = cnt?.shipments?.map((s) => s.id) || [];
  const displayedShipments =
    containerShipmentIds.length > 0
      ? shipments.filter((s) => containerShipmentIds.includes(s.id))
      : shipments;

  const estRevenue = displayedShipments.reduce(
    (sum, s) => sum + (s.shippingFee || 0),
    0
  ) || 4300000;
  const parsedCost =
    Number(costAmount.replace(/[^0-9]/g, "")) || cnt?.cost || 3200000;
  const estProfit = estRevenue - parsedCost;

  const handleCycleStatus = async () => {
    const order: ContainerState[] = ["Open", "In transit", "Arrived"];
    const next = order[(order.indexOf(status) + 1) % order.length];
    if (cnt) {
      await updateContainer(cnt.id, { status: next });
    }
  };

  const handleShip = () => {
    showConfirm({
      variant: "ship",
      title: `Ship ${cnt?.id || "C-001"}?`,
      line1: `${cnt?.boxes ?? 40} boxes`,
      line2: "1 without deposit",
      cancelLabel: "Cancel",
      confirmLabel: "Ship",
      onConfirm: async () => {
        if (cnt) {
          await updateContainer(cnt.id, { status: "In transit" });
        }
        go("32");
      },
    });
  };

  const handleArrived = async () => {
    if (cnt) {
      await updateContainer(cnt.id, { status: "Arrived" });
    }
    go("37");
  };

  const handleSaveCost = async () => {
    if (cnt) {
      await updateContainer(cnt.id, {
        cost: parsedCost,
        profit: estRevenue - parsedCost,
      });
    }
    setEditingCost(false);
  };

  return (
    <ScreenLayout
      showBack
      onBack={back}
      rightIcon="plus"
      onRightAction={() => go("35")}
      hasNav={false}
      headerChildren={
        <div className="flex items-center gap-3">
          <span className="text-[22px] font-extrabold tracking-tight text-[var(--ink)]">
            {cnt?.id || "C-001"}
          </span>
          <button
            type="button"
            onClick={handleCycleStatus}
            className="cursor-pointer"
            title="Tap to cycle status preview"
          >
            <StatusChip status={status} />
          </button>
        </div>
      }
      footer={
        status === "Open" ? (
          <div className="flex flex-col gap-2.5 w-full">
            <Button
              variant="soft"
              className="w-full"
              onClick={() => go("36")}
            >
              Scan boxes
            </Button>
            <Button
              variant="primary"
              className="w-full"
              onClick={handleShip}
            >
              Shipped
            </Button>
          </div>
        ) : status === "In transit" ? (
          <Button
            variant="primary"
            className="w-full"
            onClick={handleArrived}
          >
            Arrived
          </Button>
        ) : (
          <Button
            variant="primary"
            className="w-full"
            onClick={() => go("37")}
          >
            Scan-check
          </Button>
        )
      }
    >
      <div className="flex flex-col gap-5 pt-1 pb-4">
        {/* Route & Boxes Metadata */}
        <div className="flex flex-col gap-1 select-none">
          <div className="flex items-center gap-1.5 text-[14px] text-[var(--muted)]">
            <span>Guangzhou</span>
            <Icon name="arrow-right" size={14} color="var(--muted)" />
            <span>Douala</span>
          </div>
          <span className="text-[14px] font-medium text-[var(--muted)]">
            {cnt?.boxes ?? 40} boxes · {cnt?.size || "40ft"}
          </span>
        </div>

        {/* Expenses & Financials Card */}
        <div
          className="p-4 rounded-[18px] flex flex-col gap-2 select-none"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-bold text-[var(--ink)]">
              Container expenses
            </span>
            <button
              type="button"
              onClick={() => setEditingCost(true)}
              className="text-[13px] font-semibold text-[var(--accent)] hover:underline cursor-pointer"
            >
              Edit cost
            </button>
          </div>
          <div className="flex items-baseline justify-between mt-0.5">
            <span className="text-[13px] text-[var(--muted)]">Total cost:</span>
            <span className="text-[16px] font-extrabold text-[var(--ink)]">
              {parsedCost.toLocaleString()} FCFA
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-[13px] text-[var(--muted)]">Est. revenue:</span>
            <span className="text-[14px] font-semibold text-[var(--ink)]">
              {estRevenue.toLocaleString()} FCFA
            </span>
          </div>
          <div className="flex items-baseline justify-between border-t border-[var(--field)] pt-1.5 mt-0.5">
            <span className="text-[13px] font-semibold text-[var(--accent)]">Est. profit:</span>
            <span className="text-[15px] font-bold text-[var(--accent)]">
              {estProfit >= 0 ? "+" : ""}
              {estProfit.toLocaleString()} FCFA
            </span>
          </div>
        </div>

        {/* Edit Cost Dialog */}
        {editingCost && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 select-none"
            onClick={() => setEditingCost(false)}
          >
            <div
              className="w-full max-w-[340px] p-5 rounded-[22px] bg-[var(--surface)] flex flex-col gap-3 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-[17px] font-bold text-[var(--ink)]">
                Set container cost
              </span>
              <span className="text-[13px] text-[var(--muted)]">
                Enter total shipping line, customs, and port clearance cost in FCFA.
              </span>
              <input
                type="text"
                value={costAmount}
                onChange={(e) => setCostAmount(e.target.value)}
                placeholder="e.g. 3,200,000"
                className="w-full h-[48px] px-3.5 rounded-[12px] bg-[var(--field)] text-[15px] font-semibold text-[var(--ink)] outline-none"
              />
              <div className="flex gap-2 pt-2">
                <Button
                  variant="soft"
                  className="flex-1"
                  onClick={() => setEditingCost(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handleSaveCost}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Shipments List */}
        <div className="flex flex-col gap-2.5 select-none">
          <span className="text-[17px] font-bold text-[var(--ink)] tracking-tight">
            Shipments
          </span>

          <div className="flex flex-col gap-2">
            {displayedShipments.map((shp) => {
              const initials = shp.clientName
                .split(" ")
                .map((n) => n[0])
                .join("");

              return (
                <div
                  key={shp.id}
                  onClick={() => {
                    setSelectedShipmentId(shp.id);
                    go("26");
                  }}
                  className="p-3.5 rounded-[16px] flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
                  style={{
                    backgroundColor: "var(--surface)",
                    boxShadow: "var(--shadow-subtle)",
                  }}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-[14px] shrink-0"
                      style={{
                        backgroundColor: "var(--accent-tint)",
                        color: "var(--accent)",
                      }}
                    >
                      {initials}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[15px] font-bold text-[var(--ink)] truncate">
                        {shp.id}
                      </span>
                      <span className="text-[13px] text-[var(--muted)] truncate">
                        {shp.clientName}
                      </span>
                      <span className="text-[12px] text-[var(--placeholder)]">
                        {shp.boxes} boxes
                      </span>
                    </div>
                  </div>

                  <Icon name="chevron-right" size={18} color="var(--muted)" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ScreenLayout>
  );
};
