import React from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Icon } from "../components/Icon";
import { Button } from "../components/Button";
import { useDemo } from "../context/Demo";

export const S17HomeFrontDesk: React.FC = () => {
  const { go, setMoreSheetOpen, shipments, clients, setSelectedClientId } = useDemo();

  const expectedCount = shipments.filter((s) => s.status === "Expected").length;
  const readyCount = shipments.filter(
    (s) => s.status === "Ready" || s.status === "Arrived"
  ).length;
  const clientsWithBalance = clients.filter((c) => c.balance > 0);
  const displayClients =
    clientsWithBalance.length > 0 ? clientsWithBalance : clients.slice(0, 3);

  return (
    <ScreenLayout
      title="Home"
      hasNav={true}
      avatarInitial="A"
      onAvatarClick={() => setMoreSheetOpen(true)}
    >
      <div className="flex flex-col gap-5 pt-1 pb-4">
        {/* 3 Metric Tiles Side-by-Side */}
        <div className="grid grid-cols-3 gap-2.5 select-none">
          <div
            onClick={() => go("23")}
            className="p-3.5 rounded-[18px] flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-all min-h-[106px]"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div className="text-[var(--accent)] mb-2">
              <Icon name="file-text" size={20} color="var(--accent)" />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-medium text-[var(--muted)]">
                Expected
              </span>
              <span className="text-[20px] font-bold text-[var(--ink)] leading-none mt-1">
                {expectedCount}
              </span>
            </div>
          </div>

          <div
            onClick={() => go("23")}
            className="p-3.5 rounded-[18px] flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-all min-h-[106px]"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div className="text-[var(--accent)] mb-2">
              <Icon name="check" size={20} color="var(--accent)" />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-medium text-[var(--muted)]">
                Ready
              </span>
              <span className="text-[20px] font-bold text-[var(--ink)] leading-none mt-1">
                {readyCount}
              </span>
            </div>
          </div>

          <div
            onClick={() => go("39")}
            className="p-3.5 rounded-[18px] flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-all min-h-[106px]"
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
                Balances
              </span>
              <span className="text-[20px] font-bold text-[var(--ink)] leading-none mt-1">
                {clientsWithBalance.length}
              </span>
            </div>
          </div>
        </div>

        {/* Balances Section */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[17px] font-bold text-[var(--ink)] tracking-tight">
            Balances
          </span>

          <div className="flex flex-col gap-2">
            {displayClients.map((client) => {
              const initials = client.name
                .split(" ")
                .map((n) => n[0])
                .join("");
              return (
                <div
                  key={client.id}
                  onClick={() => {
                    setSelectedClientId(client.id);
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
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[14px] shrink-0"
                      style={{
                        backgroundColor: "var(--accent-tint)",
                        color: "var(--accent)",
                      }}
                    >
                      {initials}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[15px] font-semibold text-[var(--ink)] leading-tight truncate">
                        {client.name}
                      </span>
                      <span className="text-[13px] text-[var(--muted)] leading-tight mt-0.5 truncate">
                        {client.code}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-[14px] font-semibold text-[var(--ink)]">
                      {client.balance.toLocaleString()} FCFA
                    </span>
                    <Icon name="chevron-right" size={18} color="var(--muted)" />
                  </div>
                </div>
              );
            })}

            {displayClients.length === 0 && (
              <div
                className="p-6 rounded-[18px] flex flex-col items-center text-center gap-2 select-none"
                style={{
                  backgroundColor: "var(--surface)",
                  boxShadow: "var(--shadow-subtle)",
                }}
              >
                <span className="text-[15px] font-bold text-[var(--ink)]">
                  No client balances yet
                </span>
                <p className="text-[13px] text-[var(--muted)] max-w-[240px]">
                  Add a client and create a pre-alert to track deposits and balances.
                </p>
                <div className="flex gap-2 mt-1">
                  <Button variant="soft" size="sm" onClick={() => go("20")}>
                    Add client
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => go("24")}>
                    New pre-alert
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ScreenLayout>
  );
};
