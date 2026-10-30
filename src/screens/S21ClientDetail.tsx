import React from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { StatusChip } from "../components/Chip";
import { useDemo } from "../context/Demo";

export const S21ClientDetail: React.FC = () => {
  const {
    back,
    go,
    clients,
    selectedClientId,
    shipments,
    setSelectedShipmentId,
  } = useDemo();

  const client =
    clients.find((c) => c.id === selectedClientId) || clients[0];

  if (!client) {
    return (
      <ScreenLayout showBack onBack={back} title="Client detail" hasNav={false}>
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3 select-none">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--accent-tint)" }}
          >
            <Icon name="user" size={24} color="var(--accent)" />
          </div>
          <span className="text-[17px] font-bold text-[var(--ink)]">
            No client selected
          </span>
          <p className="text-[13px] text-[var(--muted)] max-w-[240px]">
            Add your first client to start tracking their shipments and balances.
          </p>
          <Button variant="primary" size="sm" onClick={() => go("20")}>
            Add client
          </Button>
        </div>
      </ScreenLayout>
    );
  }

  const initials = client.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const clientShipments = shipments.filter(
    (s) => s.clientName === client.name || s.clientCode === client.code
  );

  const handleMessage = () => {
    const digits = client.whatsapp.replace(/[^0-9]/g, "");
    const link = document.createElement("a");
    link.href = `https://wa.me/${digits || "237600000000"}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  };

  return (
    <ScreenLayout
      showBack
      onBack={back}
      title="Client detail"
      rightIcon="pencil"
      onRightAction={() => go("22")}
      hasNav={false}
      footer={
        <div className="flex items-center gap-3 w-full">
          <Button
            variant="soft"
            className="flex-1"
            onClick={() => go("24")}
          >
            Pre-alert
          </Button>
          <Button
            variant="primary"
            icon="whatsapp"
            className="flex-1"
            onClick={handleMessage}
          >
            Message
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-5 pt-1 pb-4">
        {/* Client Profile Header Card */}
        <div
          className="p-5 rounded-[20px] flex flex-col items-center text-center gap-3 select-none"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-[22px]"
            style={{
              backgroundColor: "var(--accent-tint)",
              color: "var(--accent)",
            }}
          >
            {initials}
          </div>

          <div className="flex flex-col">
            <h2 className="text-[20px] font-bold text-[var(--ink)] leading-snug">
              {client.name}
            </h2>
            <span className="text-[13px] text-[var(--muted)] mt-0.5">
              {client.code} · {client.city}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[14px] font-medium text-[var(--ink)] mt-1">
            <Icon name="whatsapp" size={16} color="#25D366" />
            <span>{client.whatsapp}</span>
          </div>
        </div>

        {/* 2 Metric Tiles */}
        <div className="grid grid-cols-2 gap-3 select-none">
          <div
            className="p-4 rounded-[16px] flex flex-col justify-between"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div className="text-[var(--accent)] mb-2">
              <Icon name="box" size={20} color="var(--accent)" />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-medium text-[var(--muted)]">
                Shipments
              </span>
              <span className="text-[22px] font-bold text-[var(--ink)] leading-none mt-1">
                {clientShipments.length}
              </span>
            </div>
          </div>

          <div
            className="p-4 rounded-[16px] flex flex-col justify-between"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div className="text-[var(--accent)] mb-2">
              <Icon name="credit-card" size={20} color="var(--accent)" />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-medium text-[var(--muted)]">
                Balance
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-[18px] font-bold text-[var(--ink)] leading-none">
                  {client.balance.toLocaleString()}
                </span>
                <span className="text-[11px] font-semibold text-[var(--muted)]">
                  FCFA
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Shipments Section */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[17px] font-bold text-[var(--ink)] tracking-tight">
            Shipments
          </span>

          <div className="flex flex-col gap-2 select-none">
            {clientShipments.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedShipmentId(item.id);
                  go("26");
                }}
                className="h-[68px] px-4 rounded-[16px] flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
                style={{
                  backgroundColor: "var(--surface)",
                  boxShadow: "var(--shadow-subtle)",
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: "var(--accent-tint)",
                      color: "var(--accent)",
                    }}
                  >
                    <Icon name="box" size={18} color="var(--accent)" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[15px] font-semibold text-[var(--ink)] leading-tight truncate">
                      {item.id}
                    </span>
                    <span className="text-[12px] text-[var(--muted)] leading-tight mt-0.5 truncate">
                      {item.route} · {item.boxes} boxes
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <StatusChip status={item.status} />
                  <Icon name="chevron-right" size={16} color="var(--muted)" />
                </div>
              </div>
            ))}

            {clientShipments.length === 0 && (
              <div
                className="p-5 rounded-[16px] text-center text-[13px] text-[var(--muted)]"
                style={{ backgroundColor: "var(--surface)" }}
              >
                No shipments for {client.name} yet. Tap Pre-alert below to add one.
              </div>
            )}
          </div>
        </div>
      </div>
    </ScreenLayout>
  );
};
