import React from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Icon, IconName } from "../components/Icon";
import { StatusChip } from "../components/Chip";
import { useDemo } from "../context/Demo";

interface GetStartedItem {
  id: string;
  label: string;
  subtitle: string;
  icon: IconName;
}

const GET_STARTED_ROWS: GetStartedItem[] = [
  {
    id: "12",
    label: "Add staff",
    subtitle: "Invite warehouse or front desk staff",
    icon: "user",
  },
  {
    id: "20",
    label: "Add client",
    subtitle: "Create your first client code (e.g. CLI-001)",
    icon: "user",
  },
  {
    id: "24",
    label: "New pre-alert",
    subtitle: "Create shipment SHP-1001 & QR tracking link",
    icon: "file-text",
  },
];

export const S16HomeOwner: React.FC = () => {
  const {
    go,
    shipments,
    clients,
    containers,
    payments,
    setSelectedShipmentId,
    setSelectedClientId,
    setSelectedPaymentId,
  } = useDemo();

  const totalOwed = shipments.reduce(
    (sum, s) => sum + (s.balance > 0 ? s.balance : 0),
    0
  );
  const latestPayment = payments[0];
  const latestShipment = shipments[0];
  const latestClient = clients[0];

  const isFreshWorkspace =
    shipments.length === 0 && clients.length === 0 && payments.length === 0;

  return (
    <ScreenLayout title="Home" hasNav={true}>
      <div className="flex flex-col gap-5 pt-1 pb-4">
        {/* 2x2 Summary Metric Tiles */}
        <div className="grid grid-cols-2 gap-3 select-none">
          {/* Shipments Tile */}
          <div
            onClick={() => go("23")}
            className="p-4 rounded-[18px] flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-all min-h-[110px]"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div className="text-[var(--accent)] mb-2">
              <Icon name="truck" size={22} color="var(--accent)" />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-[var(--muted)]">
                Shipments
              </span>
              <span className="text-[22px] font-bold text-[var(--ink)] leading-none mt-1">
                {shipments.length}
              </span>
            </div>
          </div>

          {/* Clients Tile */}
          <div
            onClick={() => go("19")}
            className="p-4 rounded-[18px] flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-all min-h-[110px]"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div className="text-[var(--accent)] mb-2">
              <Icon name="user" size={22} color="var(--accent)" />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-[var(--muted)]">
                Clients
              </span>
              <span className="text-[22px] font-bold text-[var(--ink)] leading-none mt-1">
                {clients.length}
              </span>
            </div>
          </div>

          {/* Containers Tile */}
          <div
            onClick={() => go("32")}
            className="p-4 rounded-[18px] flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-all min-h-[110px]"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div className="text-[var(--accent)] mb-2">
              <Icon name="layers" size={22} color="var(--accent)" />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-[var(--muted)]">
                Containers
              </span>
              <span className="text-[22px] font-bold text-[var(--ink)] leading-none mt-1">
                {containers.length}
              </span>
            </div>
          </div>

          {/* Owed Tile */}
          <div
            onClick={() => go("39")}
            className="p-4 rounded-[18px] flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-all min-h-[110px]"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div className="text-[var(--accent)] mb-2">
              <Icon name="credit-card" size={22} color="var(--accent)" />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-[var(--muted)]">
                Owed
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-[17px] font-bold text-[var(--ink)] leading-none">
                  {totalOwed.toLocaleString()}
                </span>
                <span className="text-[11px] font-semibold text-[var(--muted)]">
                  FCFA
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Logislo Copilot Entry Card (Owner Only, Opens Dedicated Gemini-style Screen) */}
        <div
          onClick={() => go("60")}
          className="p-4 rounded-[18px] flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all select-none"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className="w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, #0B5FFF 0%, #3B82F6 100%)",
                color: "#FFFFFF",
              }}
            >
              <Icon name="sparkles" size={18} color="#FFFFFF" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-bold text-[var(--ink)] leading-tight truncate">
                  Logislo Copilot
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: "var(--accent-tint)",
                    color: "var(--accent)",
                  }}
                >
                  Pro
                </span>
              </div>
              <span className="text-[12px] text-[var(--muted)] leading-tight mt-0.5 truncate">
                Ask about sales, fast-moving cargo, or export Excel
              </span>
            </div>
          </div>

          <Icon name="chevron-right" size={18} color="var(--muted)" />
        </div>

        {/* Fresh Workspace Get Started vs Live Recent Activity */}
        {isFreshWorkspace ? (
          <div className="flex flex-col gap-2.5 select-none">
            <span className="text-[17px] font-bold text-[var(--ink)] tracking-tight">
              Get started
            </span>

            <div className="flex flex-col gap-2">
              {GET_STARTED_ROWS.map((item) => (
                <div
                  key={item.id}
                  onClick={() => go(item.id)}
                  className="h-[68px] px-4 rounded-[16px] flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
                  style={{
                    backgroundColor: "var(--surface)",
                    boxShadow: "var(--shadow-subtle)",
                  }}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: "var(--accent-tint)",
                        color: "var(--accent)",
                      }}
                    >
                      <Icon name={item.icon} size={18} color="var(--accent)" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[15px] font-semibold text-[var(--ink)] leading-tight truncate">
                        {item.label}
                      </span>
                      <span className="text-[12px] text-[var(--muted)] leading-tight mt-0.5 truncate">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>

                  <Icon name="chevron-right" size={18} color="var(--muted)" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            <span className="text-[17px] font-bold text-[var(--ink)] tracking-tight">
              Recent
            </span>

            <div className="flex flex-col gap-2">
              {latestPayment && (
                <div
                  onClick={() => {
                    setSelectedPaymentId(latestPayment.id);
                    setSelectedShipmentId(latestPayment.shipmentId);
                    go("42");
                  }}
                  className="h-[68px] px-4 rounded-[16px] flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all select-none"
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
                      <Icon name="credit-card" size={18} color="var(--accent)" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[15px] font-semibold text-[var(--ink)] leading-tight truncate">
                        Payment received
                      </span>
                      <span className="text-[13px] text-[var(--muted)] leading-tight mt-0.5 truncate">
                        {latestPayment.shipmentId} · {latestPayment.clientName}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                    <span className="text-[11px] text-[var(--muted)]">
                      {latestPayment.date}
                    </span>
                    <StatusChip status={latestPayment.type} />
                  </div>
                </div>
              )}

              {latestShipment && (
                <div
                  onClick={() => {
                    setSelectedShipmentId(latestShipment.id);
                    go("26");
                  }}
                  className="h-[68px] px-4 rounded-[16px] flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all select-none"
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
                        New shipment
                      </span>
                      <span className="text-[13px] text-[var(--muted)] leading-tight mt-0.5 truncate">
                        {latestShipment.id} · {latestShipment.clientName}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                    <span className="text-[11px] text-[var(--muted)]">
                      {latestShipment.dateLabel || "Today"}
                    </span>
                    <StatusChip status={latestShipment.status} />
                  </div>
                </div>
              )}

              {latestClient && (
                <div
                  onClick={() => {
                    setSelectedClientId(latestClient.id);
                    go("21");
                  }}
                  className="h-[68px] px-4 rounded-[16px] flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all select-none"
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
                      <Icon name="user" size={18} color="var(--accent)" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[15px] font-semibold text-[var(--ink)] leading-tight truncate">
                        Client added
                      </span>
                      <span className="text-[13px] text-[var(--muted)] leading-tight mt-0.5 truncate">
                        {latestClient.name} ({latestClient.code})
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                    <span
                      className="px-2.5 py-1 rounded-full text-[12px] font-medium leading-none"
                      style={{
                        backgroundColor: "var(--accent-tint)",
                        color: "var(--accent)",
                      }}
                    >
                      Client
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ScreenLayout>
  );
};
