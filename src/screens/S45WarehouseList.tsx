import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Segmented } from "../components/Segmented";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { useDemo } from "../context/Demo";

interface WarehouseListProps {
  forceBasicOverlay?: boolean;
}

export const S45WarehouseList: React.FC<WarehouseListProps> = ({
  forceBasicOverlay = false,
}) => {
  const { back, go, plan, shipments, setSelectedShipmentId } = useDemo();
  const [office, setOffice] = useState("Guangzhou");

  const showOverlay = forceBasicOverlay || plan === "Basic";

  const storageShipments = shipments.filter((s) =>
    office === "Guangzhou"
      ? s.status === "Expected" || s.status === "Received"
      : s.status === "Arrived" || s.status === "Ready"
  );

  const handleWhatsApp = (clientName: string, shipmentId: string) => {
    const text = encodeURIComponent(
      `Hello ${clientName}, your goods (${shipmentId}) are currently in storage at ${office}.`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <ScreenLayout
      showBack
      onBack={back}
      hasNav={true}
      headerChildren={
        <div className="flex items-center justify-between w-full">
          <span className="text-[22px] font-extrabold tracking-tight text-[var(--ink)]">
            Warehouse list
          </span>
          <span
            className="px-2.5 py-1 rounded-full text-[12px] font-semibold"
            style={{
              backgroundColor: "var(--accent)",
              color: "#FFFFFF",
            }}
          >
            Pro
          </span>
        </div>
      }
    >
      <div className="flex flex-col gap-4 pt-1 pb-4 relative min-h-full select-none">
        {/* Office Toggle */}
        <Segmented
          options={["Guangzhou", "Douala"]}
          value={office}
          onChange={setOffice}
        />

        <span className="text-[16px] font-bold text-[var(--ink)] tracking-tight pt-1">
          Goods in storage ({storageShipments.length})
        </span>

        {/* Storage Goods Rows */}
        {storageShipments.length === 0 ? (
          <div
            className="p-6 rounded-[20px] flex flex-col items-center text-center gap-2"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "var(--accent-tint)",
                color: "var(--accent)",
              }}
            >
              <Icon name="box" size={20} color="var(--accent)" />
            </div>
            <span className="text-[14px] font-bold text-[var(--ink)]">
              No goods in {office} storage
            </span>
            <span className="text-[12px] text-[var(--muted)]">
              Shipments currently stored at {office} will appear here automatically.
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {storageShipments.map((item) => {
              const initials = item.clientName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2);

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedShipmentId(item.id);
                    go("26");
                  }}
                  className="p-4 rounded-[18px] flex items-center justify-between cursor-pointer active:scale-[0.99] transition-transform"
                  style={{
                    backgroundColor: "var(--surface)",
                    boxShadow: "var(--shadow-subtle)",
                  }}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-[14px] shrink-0"
                      style={{
                        backgroundColor: "var(--accent-tint)",
                        color: "var(--accent)",
                      }}
                    >
                      {initials}
                    </div>

                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-[15px] font-bold text-[var(--ink)] truncate">
                        {item.clientName}
                      </span>
                      <span className="text-[13px] text-[var(--muted)]">
                        {item.id} · {item.clientCode}
                      </span>
                      <span className="text-[12px] text-[var(--muted)] mt-0.5">
                        {item.boxes} box · {item.weightKg ?? 0} kg
                      </span>
                      <span className="text-[15px] font-extrabold text-[var(--ink)] mt-1">
                        {(item.shippingFee || 0).toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>

                  {/* WhatsApp Action Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWhatsApp(item.clientName, item.id);
                    }}
                    className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-transform shrink-0"
                    style={{
                      backgroundColor: "var(--accent-tint)",
                      color: "var(--accent)",
                    }}
                    aria-label="Message on WhatsApp"
                  >
                    <Icon name="whatsapp" size={18} color="var(--accent)" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Screen 46: Basic Plan Locked Overlay */}
        {showOverlay && (
          <div
            className="fixed inset-0 z-40 flex items-center justify-center p-6"
            style={{ backgroundColor: "rgba(11, 13, 23, 0.45)" }}
          >
            <div
              className="w-full max-w-[360px] p-6 rounded-[24px] flex flex-col items-center text-center gap-3 relative"
              style={{
                backgroundColor: "var(--surface)",
                boxShadow: "var(--shadow-dialog)",
              }}
            >
              <button
                type="button"
                onClick={back}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[var(--muted)] cursor-pointer"
                aria-label="Close"
              >
                <Icon name="close" size={18} color="var(--muted)" />
              </button>

              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-1"
                style={{
                  backgroundColor: "var(--accent-tint)",
                  color: "var(--accent)",
                }}
              >
                <Icon name="lock" size={26} color="var(--accent)" />
              </div>

              <h3 className="text-[20px] font-extrabold text-[var(--ink)]">
                Pro
              </h3>

              <p className="text-[14px] text-[var(--muted)] leading-relaxed">
                This feature is available in Pro plan. Upgrade now to access the warehouse list.
              </p>

              <div className="w-full pt-2">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => go("15")}
                >
                  Upgrade
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ScreenLayout>
  );
};

export const S46WarehouseListBasic: React.FC = () => {
  return <S45WarehouseList forceBasicOverlay={true} />;
};
